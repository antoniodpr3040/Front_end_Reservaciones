import { useEffect, useRef, useState } from 'react';
import {
  createReservation,
  listAllOccupiedSlots,
  listReservations,
  type OccupiedSlotResponse,
  type ReservationRecordResponse,
} from '../api/reservations';
import { useAuth } from '../auth/AuthContext';
import { HistoryRow } from '../components/dashboard/HistoryRow';
import { SpaceCard } from '../components/dashboard/SpaceCard';
import { SubSpaceCatalogModal } from '../components/dashboard/SubSpaceCatalogModal';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { dashboardSpaces } from '../data/mockData';
import type {
  HistoryEntry,
  HistoryStatus,
  ReservationConfirmation,
  SpaceCardData,
  SpaceStatus,
  SubSpaceItem,
} from '../types/reservations';

interface DashboardViewProps {
  onConfirmBooking: (reservationConfirmation: ReservationConfirmation | null, failureLocation?: string) => void;
  onNavigateToReservations: () => void;
}

interface OccupiedTimeBlock {
  endMinutes: number;
  id: string;
  startMinutes: number;
}

const MONTH_LABEL = new Intl.DateTimeFormat('es-SV', {
  month: 'long',
  year: 'numeric',
});

const FULL_DATE_LABEL = new Intl.DateTimeFormat('es-SV', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const HISTORY_DATE_LABEL = new Intl.DateTimeFormat('es-SV', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const HISTORY_TIME_LABEL = new Intl.DateTimeFormat('es-SV', {
  hour: 'numeric',
  minute: '2-digit',
});
const HISTORY_SYNC_LABEL = new Intl.DateTimeFormat('es-SV', {
  hour: 'numeric',
  minute: '2-digit',
});

const SLOT_INTERVAL_MINUTES = 30;
const DEFAULT_DAY_START_MINUTES = 5 * 60;
const DEFAULT_DAY_END_MINUTES = 20 * 60;
const SATURDAY_DAY_END_MINUTES = 12 * 60;
const TIMELINE_SLOT_HEIGHT = 44;
const SPACE_MATCHERS: Record<string, string[]> = {
  biblioteca: ['biblioteca'],
  'laboratorio-computacion': ['lab de computacion'],
  'laboratorio-fisica': ['lab de fisica'],
  'laboratorio-quimica': ['lab de quimica'],
  'mentoria-1': ['sala de mentoria 1'],
  'mentoria-2': ['sala de mentoria 2'],
  'mentoria-3': ['sala de mentoria 3'],
};

type DragMode = 'create' | 'move' | 'resize-start' | 'resize-end';

interface DragState {
  anchorMinutes?: number;
  endMinutes: number;
  mode: DragMode;
  pointerStartY: number;
  startMinutes: number;
}

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fromDateInputValue(value: string) {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function createTimeSlots(startMinutes: number, endMinutes: number) {
  const options: string[] = [];

  for (
    let minutes = startMinutes;
    minutes < endMinutes;
    minutes += SLOT_INTERVAL_MINUTES
  ) {
    options.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`);
  }

  return options;
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);

  return hours * 60 + minutes;
}

function minutesToTimeValue(totalMinutes: number) {
  return `${pad(Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}`;
}

function toReservationDateTime(dateValue: string, timeValue: string) {
  return `${dateValue}T${timeValue}:00`;
}

function formatTimeLabel(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const normalizedHours = hours % 12 || 12;

  return `${normalizedHours}:${pad(minutes)} ${suffix}`;
}

function formatDurationLabel(durationMinutes: number) {
  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  }

  const hours = durationMinutes / 60;

  return Number.isInteger(hours) ? `${hours} h` : `${hours.toFixed(1)} h`;
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function isSunday(date: Date) {
  return date.getDay() === 0;
}

function getReservationDayEndMinutes(date: Date) {
  return date.getDay() === 6 ? SATURDAY_DAY_END_MINUTES : DEFAULT_DAY_END_MINUTES;
}

function getNextAvailableReservationDate(date: Date) {
  const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  while (isSunday(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundUpToNextSlot(minutes: number) {
  return Math.ceil(minutes / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES;
}

function roundDownToSlot(minutes: number) {
  return Math.floor(minutes / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES;
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function resolveSpaceValueFromText(value: string) {
  const normalizedValue = normalizeText(value);

  for (const [spaceValue, aliases] of Object.entries(SPACE_MATCHERS)) {
    if (aliases.some((alias) => normalizedValue.includes(alias))) {
      return spaceValue;
    }
  }

  return undefined;
}

function getReservationSpaceValue(reservation: { title: string; location?: string | null }) {
  return resolveSpaceValueFromText(
    `${reservation.title} ${reservation.location ?? ''}`,
  );
}

function isCancelledReservation(reservation: { status: string }) {
  return reservation.status.toLowerCase() === 'cancelled';
}

function isActiveReservation(reservation: { status: string; end: string }, now: Date) {
  return !isCancelledReservation(reservation) && new Date(reservation.end) > now;
}

function rangesOverlap(
  startMinutes: number,
  endMinutes: number,
  blockStartMinutes: number,
  blockEndMinutes: number,
) {
  return startMinutes < blockEndMinutes && endMinutes > blockStartMinutes;
}

function isRangeAvailable(
  startMinutes: number,
  endMinutes: number,
  occupiedBlocks: OccupiedTimeBlock[],
) {
  return occupiedBlocks.every(
    (block) =>
      !rangesOverlap(
        startMinutes,
        endMinutes,
        block.startMinutes,
        block.endMinutes,
      ),
  );
}

function getMinutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function formatHistoryTimeRange(start: Date, end: Date) {
  return `${HISTORY_TIME_LABEL.format(start)} - ${HISTORY_TIME_LABEL.format(end)}`;
}

function getHistoryStatus(
  reservation: ReservationRecordResponse,
  now: Date,
): HistoryStatus {
  if (isCancelledReservation(reservation)) {
    return 'Cancelada';
  }

  if (new Date(reservation.end) < now) {
    return 'Completada';
  }

  return 'Activa';
}

function getHistoryStatusClasses(status: HistoryStatus) {
  return status === 'Completada'
    ? 'bg-green-100 text-green-800'
    : status === 'Cancelada'
      ? 'bg-error-container text-error'
      : 'bg-secondary-container text-on-secondary-container';
}

function toHistoryEntry(
  reservation: ReservationRecordResponse,
  userName: string,
  now: Date,
): HistoryEntry {
  const startDate = new Date(reservation.start);
  const endDate = new Date(reservation.end);

  return {
    id: reservation.reservation_id,
    user: userName,
    space: reservation.location?.trim() || reservation.title,
    date: HISTORY_DATE_LABEL.format(startDate),
    time: formatHistoryTimeRange(startDate, endDate),
    status: getHistoryStatus(reservation, now),
  };
}

export function DashboardView({
  onConfirmBooking,
  onNavigateToReservations,
}: DashboardViewProps) {
  const { user } = useAuth();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();
  const todayAtMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const initialSelectedDate = getNextAvailableReservationDate(todayAtMidnight);
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    toDateInputValue(initialSelectedDate),
  );
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastReservationsSync, setLastReservationsSync] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<ReservationRecordResponse[]>([]);
  const [allOccupiedSlots, setAllOccupiedSlots] = useState<OccupiedSlotResponse[]>([]);
  const [reservationsError, setReservationsError] = useState('');
  const [catalogSpace, setCatalogSpace] = useState<SpaceCardData | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(
      initialSelectedDate.getFullYear(),
      initialSelectedDate.getMonth(),
      1,
    ),
  );

  const loadReservations = async () => {
    setIsLoadingReservations(true);
    setReservationsError('');

    try {
      const [userReservations, occupiedSlots] = await Promise.all([
        listReservations(),
        listAllOccupiedSlots(),
      ]);
      setReservations(userReservations);
      setAllOccupiedSlots(occupiedSlots);
      setLastReservationsSync(new Date());
    } catch (error) {
      setReservations([]);
      setAllOccupiedSlots([]);
      setReservationsError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la disponibilidad actual.',
      );
    } finally {
      setIsLoadingReservations(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const now = new Date();
  const availableSpaces: SpaceCardData[] = dashboardSpaces.map((space) => ({
    ...space,
    status: 'Disponible',
  }));
  const bookableSpaces: SpaceCardData[] = dashboardSpaces.flatMap((space) =>
    space.subSpaces?.length
      ? space.subSpaces.map((sub) => ({
          value: sub.value,
          title: sub.title,
          description: sub.description,
          status: 'Disponible' as SpaceStatus,
          icon: sub.icon,
        }))
      : [{ ...space, status: 'Disponible' as SpaceStatus }]
  );
  const historyEntries = [...reservations]
    .sort(
      (left, right) =>
        new Date(right.start).getTime() - new Date(left.start).getTime(),
    )
    .map((reservation) =>
      toHistoryEntry(
        reservation,
        user?.name ?? reservation.user_email ?? 'Usuario institucional',
        now,
      ),
    );
  const historySyncLabel = lastReservationsSync
    ? `Sincronizado con reservations.json a las ${HISTORY_SYNC_LABEL.format(lastReservationsSync)}`
    : 'Sincronizando historial con el backend';

  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOffset = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  ).getDay();
  const calendarCells = Array.from(
    { length: firstDayOffset + daysInMonth },
    (_, index) => (index < firstDayOffset ? null : index - firstDayOffset + 1),
  );
  const selectedDateParts = selectedDate.split('-').map(Number);
  const selectedDateObject = fromDateInputValue(selectedDate);
  const isSelectedDateClosed = isSunday(selectedDateObject);
  const selectedDayEndMinutes = getReservationDayEndMinutes(selectedDateObject);
  const isSelectedToday = isSameDay(selectedDateObject, todayAtMidnight);
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const timelineStartMinutes = isSelectedToday
    ? Math.max(DEFAULT_DAY_START_MINUTES, roundUpToNextSlot(currentMinutes))
    : DEFAULT_DAY_START_MINUTES;
  const timeSlots =
    !isSelectedDateClosed && timelineStartMinutes < selectedDayEndMinutes
      ? createTimeSlots(timelineStartMinutes, selectedDayEndMinutes)
      : [];
  const hasTimelineAvailability = timeSlots.length > 0;
  const selectedDay = selectedDateParts[2];
  const isSelectedMonth =
    selectedDateParts[0] === visibleMonth.getFullYear() &&
    selectedDateParts[1] === visibleMonth.getMonth() + 1;
  const selectedDateLabel = FULL_DATE_LABEL.format(selectedDateObject);
  const hasSelectedTimeRange = Boolean(startTime && endTime);
  const selectedStartMinutes = startTime ? toMinutes(startTime) : null;
  const selectedEndMinutes = endTime ? toMinutes(endTime) : null;
  const selectionDurationMinutes =
    selectedStartMinutes !== null && selectedEndMinutes !== null
      ? selectedEndMinutes - selectedStartMinutes
      : 0;
  const isCompactSelection = selectionDurationMinutes <= SLOT_INTERVAL_MINUTES;
  const selectionTop =
    selectedStartMinutes === null
      ? 0
      : ((selectedStartMinutes - timelineStartMinutes) / SLOT_INTERVAL_MINUTES) *
        TIMELINE_SLOT_HEIGHT;
  const selectionHeight =
    selectedStartMinutes === null || selectedEndMinutes === null
      ? 0
      : ((selectedEndMinutes - selectedStartMinutes) / SLOT_INTERVAL_MINUTES) *
        TIMELINE_SLOT_HEIGHT;
  const selectedSpaceDetails = bookableSpaces.find(
    (space) => space.value === selectedSpace,
  );
  const relevantReservations = allOccupiedSlots.filter((reservation) => {
    if (!selectedSpace) {
      return false;
    }

    if (!isActiveReservation(reservation, now)) {
      return false;
    }

    return getReservationSpaceValue(reservation) === selectedSpace;
  });
  const occupiedTimeBlocks = relevantReservations
    .filter((reservation) => {
      const reservationDate = new Date(reservation.start);

      return isSameDay(reservationDate, selectedDateObject);
    })
    .map((reservation) => {
      const startDate = new Date(reservation.start);
      const endDate = new Date(reservation.end);

      return {
        id: reservation.reservation_id,
        startMinutes: clamp(
          roundDownToSlot(getMinutesFromDate(startDate)),
          timelineStartMinutes,
          selectedDayEndMinutes,
        ),
        endMinutes: clamp(
          roundUpToNextSlot(getMinutesFromDate(endDate)),
          timelineStartMinutes,
          selectedDayEndMinutes,
        ),
      };
    })
    .filter((block) => block.endMinutes > block.startMinutes)
    .sort((left, right) => left.startMinutes - right.startMinutes);
  const occupiedDays = new Set(
    relevantReservations
      .filter((reservation) => {
        const reservationDate = new Date(reservation.start);

        return (
          reservationDate.getFullYear() === visibleMonth.getFullYear() &&
          reservationDate.getMonth() === visibleMonth.getMonth()
        );
      })
      .map((reservation) => new Date(reservation.start).getDate()),
  );
  const reservationSummary = !selectedSpace
    ? 'Selecciona un espacio para revisar la disponibilidad.'
    : isLoadingReservations
      ? 'Cargando horarios ocupados...'
      : reservationsError
        ? 'No se pudo validar la disponibilidad actual.'
        : hasSelectedTimeRange
          ? `De ${formatTimeLabel(startTime)} a ${formatTimeLabel(endTime)}`
          : occupiedTimeBlocks.length > 0
            ? 'Las franjas oscuras ya estan reservadas y no se pueden usar.'
            : 'Arrastra sobre la agenda para crear un bloque.';
  const canInteractWithTimeline =
    hasTimelineAvailability &&
    Boolean(selectedSpace) &&
    !isLoadingReservations &&
    !reservationsError;

  const setReservationRange = (startMinutes: number, endMinutes: number) => {
    setStartTime(minutesToTimeValue(startMinutes));
    setEndTime(minutesToTimeValue(endMinutes));
  };

  const resetTimeSelection = () => {
    setStartTime('');
    setEndTime('');
    setDragState(null);
  };

  const handleSpaceChange = (value: string) => {
    setSelectedSpace(value);
    resetTimeSelection();
  };

  useEffect(() => {
    if (
      selectedStartMinutes === null ||
      selectedEndMinutes === null ||
      isRangeAvailable(selectedStartMinutes, selectedEndMinutes, occupiedTimeBlocks)
    ) {
      return;
    }

    resetTimeSelection();
  }, [occupiedTimeBlocks, selectedEndMinutes, selectedStartMinutes]);

  const getMinutesFromPointer = (clientY: number) => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return timelineStartMinutes;
    }

    const rect = timeline.getBoundingClientRect();
    const maxOffset =
      ((selectedDayEndMinutes - timelineStartMinutes) / SLOT_INTERVAL_MINUTES) *
        TIMELINE_SLOT_HEIGHT -
      1;
    const offsetY = clamp(clientY - rect.top, 0, maxOffset);
    const intervalIndex = Math.floor(offsetY / TIMELINE_SLOT_HEIGHT);

    return timelineStartMinutes + intervalIndex * SLOT_INTERVAL_MINUTES;
  };

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (dragState.mode === 'create') {
        const pointerMinutes = getMinutesFromPointer(event.clientY);
        const anchorMinutes = dragState.anchorMinutes ?? dragState.startMinutes;

        if (pointerMinutes >= anchorMinutes) {
          const requestedEnd = Math.min(
            pointerMinutes + SLOT_INTERVAL_MINUTES,
            selectedDayEndMinutes,
          );
          const blockingReservation = occupiedTimeBlocks.find((block) =>
            rangesOverlap(
              anchorMinutes,
              requestedEnd,
              block.startMinutes,
              block.endMinutes,
            ),
          );
          const nextEnd = blockingReservation
            ? blockingReservation.startMinutes
            : requestedEnd;

          if (nextEnd > anchorMinutes) {
            setReservationRange(anchorMinutes, nextEnd);
          }

          return;
        }

        const requestedStart = pointerMinutes;
        const blockingReservation = [...occupiedTimeBlocks].reverse().find((block) =>
          rangesOverlap(
            requestedStart,
            anchorMinutes + SLOT_INTERVAL_MINUTES,
            block.startMinutes,
            block.endMinutes,
          ),
        );
        const nextStart = blockingReservation
          ? blockingReservation.endMinutes
          : requestedStart;

        if (nextStart < anchorMinutes + SLOT_INTERVAL_MINUTES) {
          setReservationRange(nextStart, anchorMinutes + SLOT_INTERVAL_MINUTES);
        }

        return;
      }

      if (dragState.mode === 'move') {
        const deltaIntervals = Math.round(
          (event.clientY - dragState.pointerStartY) / TIMELINE_SLOT_HEIGHT,
        );
        const duration = dragState.endMinutes - dragState.startMinutes;
        const nextStart = clamp(
          dragState.startMinutes + deltaIntervals * SLOT_INTERVAL_MINUTES,
          timelineStartMinutes,
          selectedDayEndMinutes - duration,
        );
        const nextEnd = nextStart + duration;

        if (isRangeAvailable(nextStart, nextEnd, occupiedTimeBlocks)) {
          setReservationRange(nextStart, nextEnd);
        }

        return;
      }

      if (dragState.mode === 'resize-start') {
        const candidateStart = clamp(
          getMinutesFromPointer(event.clientY),
          timelineStartMinutes,
          dragState.endMinutes - SLOT_INTERVAL_MINUTES,
        );

        if (
          isRangeAvailable(candidateStart, dragState.endMinutes, occupiedTimeBlocks)
        ) {
          setReservationRange(candidateStart, dragState.endMinutes);
        }

        return;
      }

      const candidateEnd = clamp(
        getMinutesFromPointer(event.clientY) + SLOT_INTERVAL_MINUTES,
        dragState.startMinutes + SLOT_INTERVAL_MINUTES,
        selectedDayEndMinutes,
      );

      if (isRangeAvailable(dragState.startMinutes, candidateEnd, occupiedTimeBlocks)) {
        setReservationRange(dragState.startMinutes, candidateEnd);
      }
    };

    const handlePointerUp = () => {
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, occupiedTimeBlocks, selectedDayEndMinutes, timelineStartMinutes]);

  const handleReserve = (space: SpaceCardData) => {
    if (space.subSpaces?.length) {
      setCatalogSpace(space);
    } else {
      handleSpaceChange(space.value);
      document
        .getElementById('booking-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSubSpace = (sub: SubSpaceItem) => {
    setCatalogSpace(null);
    handleSpaceChange(sub.value);
    document
      .getElementById('booking-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDateChange = (value: string) => {
    const nextSelectedDate = getNextAvailableReservationDate(
      fromDateInputValue(value),
    );

    if (nextSelectedDate < todayAtMidnight) {
      return;
    }

    setSelectedDate(toDateInputValue(nextSelectedDate));
    setVisibleMonth(
      new Date(
        nextSelectedDate.getFullYear(),
        nextSelectedDate.getMonth(),
        1,
      ),
    );
    resetTimeSelection();
  };

  const selectCalendarDay = (day: number) => {
    const nextSelectedDate = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      day,
    );

    if (nextSelectedDate < todayAtMidnight || isSunday(nextSelectedDate)) {
      return;
    }

    handleDateChange(toDateInputValue(nextSelectedDate));
  };

  const handleTimelinePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canInteractWithTimeline) {
      return;
    }

    event.preventDefault();

    const startMinutes = getMinutesFromPointer(event.clientY);
    const endMinutes = Math.min(
      startMinutes + SLOT_INTERVAL_MINUTES,
      selectedDayEndMinutes,
    );

    if (!isRangeAvailable(startMinutes, endMinutes, occupiedTimeBlocks)) {
      return;
    }

    setReservationRange(startMinutes, endMinutes);
    setDragState({
      mode: 'create',
      anchorMinutes: startMinutes,
      pointerStartY: event.clientY,
      startMinutes,
      endMinutes,
    });
  };

  const startDraggingSelection = (
    event: React.PointerEvent<HTMLDivElement>,
    mode: DragMode,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedStartMinutes === null || selectedEndMinutes === null) {
      return;
    }

    setDragState({
      mode,
      pointerStartY: event.clientY,
      startMinutes: selectedStartMinutes,
      endMinutes: selectedEndMinutes,
    });
  };

  const handleSubmitReservation = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !selectedSpaceDetails ||
      !startTime ||
      !endTime ||
      isSunday(selectedDateObject) ||
      toMinutes(endTime) > selectedDayEndMinutes ||
      !isRangeAvailable(toMinutes(startTime), toMinutes(endTime), occupiedTimeBlocks)
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationPayload = {
        attendees: user?.email ? [user.email] : [],
        description: [
          'Reservacion creada desde DoDate.',
          user?.name ? `Usuario: ${user.name}` : '',
          user?.email ? `Correo: ${user.email}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
        end: toReservationDateTime(selectedDate, endTime),
        location: selectedSpaceDetails.title,
        start: toReservationDateTime(selectedDate, startTime),
        title: `Reserva - ${selectedSpaceDetails.title}`,
      };
      const createdReservation = await createReservation(reservationPayload);
      await loadReservations();
      onConfirmBooking({
        end: reservationPayload.end,
        reservationId: createdReservation.reservation_id,
        spaceDetails: selectedSpaceDetails.description,
        spaceName: reservationPayload.location,
        start: reservationPayload.start,
        webLink: createdReservation.web_link ?? undefined,
      });
    } catch (error) {
      console.error(error);
      onConfirmBooking(null, selectedSpaceDetails.title);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextShortcutDate = getNextAvailableReservationDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
  );

  return (
    <div className="flex min-h-screen flex-col">
      {catalogSpace && (
        <SubSpaceCatalogModal
          parentTitle={catalogSpace.title}
          subSpaces={catalogSpace.subSpaces!}
          onSelect={handleSelectSubSpace}
          onClose={() => setCatalogSpace(null)}
        />
      )}
      <Header
        activeTab="spaces"
        onBackToSpaces={() => undefined}
        onNavigateToReservations={onNavigateToReservations}
      />
      <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col space-y-12 px-4 pt-20 pb-10 sm:px-6 md:space-y-16 md:px-10 md:pt-24 md:pb-12 lg:px-12">
        <section className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary font-headline sm:text-4xl md:text-5xl">
            Gestion de espacios
          </h1>
          <p className="max-w-2xl text-base text-on-surface-variant font-body md:text-lg">
            Reserva el espacio de trabajo que necesitas para tu jornada.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {availableSpaces.map((space) => (
            <SpaceCard
              key={space.value}
              title={space.title}
              description={space.description}
              capacity={space.capacity}
              status={space.status}
              icon={space.icon}
              hasSubSpaces={!!space.subSpaces?.length}
              onReserve={() => handleReserve(space)}
            />
          ))}
        </section>

        <section
          id="booking-section"
          className="grid grid-cols-1 items-start gap-8 lg:gap-12 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        >
          <div className="rounded-[2rem] bg-surface-container-low p-5 sm:p-6 md:p-8 xl:p-10">
            <h2 className="mb-6 text-2xl font-bold text-primary font-headline sm:text-3xl md:mb-8">
              Nueva reservacion
            </h2>
            <form
              className="space-y-6"
              onSubmit={handleSubmitReservation}
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                  Nombre del usuario
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-outline">
                    verified_user
                  </span>
                  <input
                    type="text"
                    required
                    value={user?.name ?? 'Usuario institucional'}
                    readOnly
                    aria-readonly="true"
                    className="w-full rounded-xl border-none bg-surface-container-lowest py-3 pr-4 pl-12 text-on-surface outline-none transition-all focus:ring-2 focus:ring-surface-tint/20"
                  />
                </div>
                <p className="text-xs text-on-surface-variant">
                  Este nombre proviene de tu sesion autenticada y no se puede
                  editar desde el formulario.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                  Espacio academico
                </label>
                <select
                  required
                  value={selectedSpace}
                  onChange={(event) => handleSpaceChange(event.target.value)}
                  className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                >
                  <option value="">Seleccione un espacio...</option>
                  {dashboardSpaces.map((space) =>
                    space.subSpaces?.length ? (
                      <optgroup key={space.value} label={space.title}>
                        {space.subSpaces.map((sub) => (
                          <option key={sub.value} value={sub.value}>
                            {sub.title}
                          </option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={space.value} value={space.value}>
                        {space.title}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    min={toDateInputValue(today)}
                    value={selectedDate}
                    onChange={(event) => handleDateChange(event.target.value)}
                    className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleDateChange(toDateInputValue(initialSelectedDate))
                      }
                      className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-container-high"
                    >
                      Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDateChange(toDateInputValue(nextShortcutDate))
                      }
                      className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-container-high"
                    >
                      Mañana
                    </button>
                  </div>
                  <p className="text-xs capitalize text-on-surface-variant">
                    {selectedDateLabel}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Domingo no disponible. El sabado solo se reserva hasta las
                    12:00 PM.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                      Horario de reservacion
                    </label>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {selectedSpace
                        ? 'Las franjas bloqueadas ya tienen reserva. Arrastra solo sobre los espacios libres.'
                        : 'Selecciona un espacio academico para ver la disponibilidad horaria.'}
                    </p>
                  </div>
                  {hasSelectedTimeRange ? (
                    <button
                      type="button"
                      onClick={resetTimeSelection}
                      className="rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high"
                    >
                      Limpiar horario
                    </button>
                  ) : null}
                </div>

                {reservationsError ? (
                  <div className="rounded-2xl border border-error/15 bg-error-container/50 px-4 py-3 text-sm text-error">
                    {reservationsError}
                  </div>
                ) : null}

                {!selectedSpace ? (
                  <div className="flex items-center justify-center rounded-[1.75rem] border border-surface-container-high bg-surface-container-lowest px-6 py-14 text-center">
                    <p className="text-sm font-semibold text-on-surface-variant">
                      Selecciona un area para revisar la disponibilidad.
                    </p>
                  </div>
                ) : (
                <div className="overflow-hidden rounded-[1.75rem] border border-surface-container-high bg-surface-container-lowest">
                  <div className="flex flex-col gap-3 border-b border-surface-container-high px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                        Agenda del dia
                      </p>
                      <p className="mt-2 text-base font-bold capitalize text-primary sm:text-lg">
                        {selectedDateLabel}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-primary md:max-w-[19rem]">
                      {hasTimelineAvailability
                        ? reservationSummary
                        : 'No hay horarios disponibles para este dia.'}
                    </div>
                  </div>

                  <div className="max-h-[26rem] overflow-y-auto px-3 py-3 sm:px-4">
                    {hasTimelineAvailability ? (
                      <div className="min-w-[21.5rem] sm:min-w-[24rem]">
                        <div className="flex gap-3 sm:gap-4">
                          <div className="w-14 shrink-0 sm:w-20">
                            {timeSlots.map((slot) => (
                              <div
                                key={`label-${slot}`}
                                className="flex h-11 items-start justify-end pr-1 pt-1 text-[10px] font-semibold text-outline-variant sm:pr-2 sm:text-xs"
                              >
                                {slot.endsWith(':00') ? formatTimeLabel(slot) : ''}
                              </div>
                            ))}
                          </div>

                          <div
                            ref={timelineRef}
                            onPointerDown={handleTimelinePointerDown}
                            className={`relative flex-1 rounded-[1.5rem] bg-white select-none touch-none ${
                              canInteractWithTimeline
                                ? 'cursor-crosshair'
                                : 'cursor-not-allowed'
                            }`}
                            style={{
                              height: timeSlots.length * TIMELINE_SLOT_HEIGHT,
                            }}
                          >
                            {timeSlots.map((slot, index) => (
                              <div
                                key={`row-${slot}`}
                                className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-surface-container-high"
                                style={{ top: index * TIMELINE_SLOT_HEIGHT }}
                              />
                            ))}

                            {occupiedTimeBlocks.map((block) => {
                              const blockTop =
                                ((block.startMinutes - timelineStartMinutes) /
                                  SLOT_INTERVAL_MINUTES) *
                                TIMELINE_SLOT_HEIGHT;
                              const blockHeight =
                                ((block.endMinutes - block.startMinutes) /
                                  SLOT_INTERVAL_MINUTES) *
                                TIMELINE_SLOT_HEIGHT;
                              const blockIsCompact =
                                block.endMinutes - block.startMinutes <=
                                SLOT_INTERVAL_MINUTES;

                              return (
                                <div
                                  key={block.id}
                                  onPointerDown={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                  }}
                                  className="absolute left-2 right-2 z-10 flex cursor-not-allowed items-center rounded-3xl border border-slate-300 bg-slate-200/95 px-3 text-slate-700 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.75)] sm:left-3 sm:right-3 sm:px-4"
                                  style={{
                                    top: blockTop,
                                    height: blockHeight,
                                  }}
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-bold uppercase tracking-[0.16em]">
                                      Bloqueado
                                    </p>
                                    {!blockIsCompact ? (
                                      <p className="mt-1 truncate text-sm font-semibold">
                                        {formatTimeLabel(
                                          minutesToTimeValue(block.startMinutes),
                                        )}{' '}
                                        -{' '}
                                        {formatTimeLabel(
                                          minutesToTimeValue(block.endMinutes),
                                        )}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}

                            {hasSelectedTimeRange &&
                            selectedStartMinutes !== null &&
                            selectedEndMinutes !== null ? (
                              <div
                                className="absolute left-2 right-2 z-20 rounded-3xl bg-[#ef8f98]/75 shadow-[0_24px_48px_-30px_rgba(171,31,45,0.75)] ring-1 ring-[#e06a75] cursor-grab touch-none select-none sm:left-3 sm:right-3"
                                style={{
                                  top: selectionTop,
                                  height: selectionHeight,
                                }}
                              >
                                <div
                                  onPointerDown={(event) =>
                                    startDraggingSelection(event, 'resize-start')
                                  }
                                  className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize"
                                >
                                  <span className="absolute inset-0 rounded-full border-2 border-[#ef8f98] bg-white shadow-sm" />
                                </div>

                                <div
                                  onPointerDown={(event) =>
                                    startDraggingSelection(event, 'move')
                                  }
                                  className={`flex h-full w-full items-center justify-between cursor-grab active:cursor-grabbing select-none ${
                                    isCompactSelection
                                      ? 'px-3 py-2 sm:px-5'
                                      : 'px-3 py-3 sm:px-5 sm:py-4'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div
                                      className={`${
                                        isCompactSelection
                                          ? 'flex items-center gap-2'
                                          : 'flex items-center'
                                      }`}
                                    >
                                      <p
                                        className={`truncate font-bold text-[#8b1f2b] ${
                                          isCompactSelection
                                            ? 'text-sm sm:text-[0.95rem]'
                                            : 'text-base sm:text-[1.15rem]'
                                        }`}
                                      >
                                        {formatTimeLabel(startTime)} -{' '}
                                        {formatTimeLabel(endTime)}
                                      </p>
                                      {isCompactSelection ? (
                                        <p className="hidden truncate text-[11px] font-medium text-[#8b1f2b]/75 sm:block">
                                          Arrastra para mover la reservacion
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <span className="ml-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-[#8b1f2b] sm:ml-4 sm:px-3 sm:text-xs">
                                    {formatDurationLabel(selectionDurationMinutes)}
                                  </span>
                                </div>

                                <div
                                  onPointerDown={(event) =>
                                    startDraggingSelection(event, 'resize-end')
                                  }
                                  className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 cursor-ns-resize"
                                >
                                  <span className="absolute inset-0 rounded-full border-2 border-[#ef8f98] bg-white shadow-sm" />
                                </div>
                              </div>
                            ) : null}

                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-3xl bg-surface-container-low px-6 py-8 text-sm text-on-surface-variant">
                        {isSelectedToday
                          ? 'Las franjas de hoy ya terminaron. Selecciona otro día para crear una reservación.'
                          : 'No hay franjas configuradas para este día.'}
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
              <div className="rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant">
                Reservaras el espacio el{' '}
                <span className="font-semibold capitalize text-on-surface">
                  {selectedDateLabel}
                </span>{' '}
                {hasSelectedTimeRange ? (
                  <>
                    de{' '}
                    <span className="font-semibold text-on-surface">
                      {formatTimeLabel(startTime)}
                    </span>{' '}
                    a{' '}
                    <span className="font-semibold text-on-surface">
                      {formatTimeLabel(endTime)}
                    </span>
                    .
                  </>
                ) : (
                  <>y aun falta definir el bloque horario.</>
                )}
              </div>
              <button
                type="submit"
                disabled={!hasSelectedTimeRange || isSubmitting}
                className="w-full rounded-xl bg-primary-gradient py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all enabled:hover:opacity-90 enabled:active:scale-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70"
              >
                {isSubmitting ? 'Confirmando reserva...' : 'Confirmar reserva'}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary font-headline sm:text-3xl">
              Calendario de ocupacion
            </h2>
            <div className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5 text-primary sm:p-6">
              <span className="material-symbols-outlined">info</span>
              <div>
                <p className="font-bold">Bloques reservados</p>
                <p className="text-sm opacity-90">
                  Los dias marcados tienen al menos una reservacion activa para
                  el espacio seleccionado.
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-surface-container bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    calendar_month
                  </span>
                  <h3 className="truncate font-bold text-primary font-headline">
                    {MONTH_LABEL.format(visibleMonth)}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() - 1,
                          1,
                        ),
                      )
                    }
                    className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container-high"
                    aria-label="Ver mes anterior"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleMonth(
                        new Date(
                          visibleMonth.getFullYear(),
                          visibleMonth.getMonth() + 1,
                          1,
                        ),
                      )
                    }
                    className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container-high"
                    aria-label="Ver mes siguiente"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              <div className="calendar-grid mb-2 text-center text-[10px] font-bold tracking-widest text-outline-variant uppercase">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mie</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sab</div>
              </div>
              <div className="calendar-grid gap-1">
                {calendarCells.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const dayDate = new Date(
                    visibleMonth.getFullYear(),
                    visibleMonth.getMonth(),
                    day,
                  );
                  const isPastDay = dayDate < todayAtMidnight;
                  const isClosedDay = isSunday(dayDate);
                  const isToday = isSameDay(dayDate, todayAtMidnight);
                  const isOccupied = occupiedDays.has(day);
                  const isSelected = isSelectedMonth && selectedDay === day;

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => selectCalendarDay(day)}
                      className={`relative flex aspect-square items-center justify-center rounded-lg text-[11px] font-medium sm:text-xs ${
                        isPastDay || isClosedDay
                          ? 'cursor-not-allowed bg-surface-container-low text-outline-variant opacity-60'
                          : isSelected
                            ? 'bg-primary font-bold text-white ring-2 ring-primary/20'
                            : isOccupied
                              ? 'bg-primary/85 font-bold text-white'
                              : 'cursor-pointer text-on-surface hover:bg-surface-container'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`Seleccionar ${day} de ${MONTH_LABEL.format(visibleMonth)}`}
                      disabled={isPastDay || isClosedDay}
                    >
                      {day}
                      {isToday && !isSelected ? (
                        <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      ) : null}
                      {isOccupied ? (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white"></span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-4 border-t border-surface-container pt-4 text-[11px] font-semibold tracking-wider text-outline uppercase">

              </div>
            </div>
          </div>
        </section>

        <section id="history-section" className="space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-2xl font-bold text-primary font-headline sm:text-3xl">
              Historial de reservas
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">history</span>
              <span>{historySyncLabel}</span>
            </div>
          </div>

          {isLoadingReservations ? (
            <div className="rounded-[1.75rem] bg-surface-container-low px-6 py-10 text-center text-sm text-on-surface-variant">
              Cargando historial desde el backend...
            </div>
          ) : reservationsError ? (
            <div className="rounded-[1.75rem] border border-error/15 bg-error-container/40 px-6 py-6 text-sm text-error">
              <p className="font-semibold">{reservationsError}</p>
              <button
                type="button"
                onClick={() => void loadReservations()}
                className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-primary transition-all hover:shadow-sm active:scale-95"
              >
                Reintentar
              </button>
            </div>
          ) : historyEntries.length === 0 ? (
            <div className="rounded-[1.75rem] bg-surface-container-low px-6 py-10 text-center">
              <p className="text-lg font-bold text-primary font-headline">
                Aun no hay reservas registradas.
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Cuando el backend guarde datos en <code>reservations.json</code>,
                apareceran aqui automaticamente.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 md:hidden">
                {historyEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-[1.5rem] bg-surface-container-low p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-on-surface">
                          {entry.user}
                        </p>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {entry.space}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getHistoryStatusClasses(
                          entry.status,
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-surface-container-lowest px-4 py-3">
                        <p className="text-[11px] font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                          Fecha
                        </p>
                        <p className="mt-1 text-sm font-semibold text-on-surface">
                          {entry.date}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-surface-container-lowest px-4 py-3">
                        <p className="text-[11px] font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                          Horario
                        </p>
                        <p className="mt-1 text-sm font-semibold text-on-surface">
                          {entry.time}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-3xl bg-surface-container-low md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-surface-container-high">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                        Espacio
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                        Horario
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyEntries.map((entry) => (
                      <HistoryRow
                        key={entry.id}
                        user={entry.user}
                        space={entry.space}
                        date={entry.date}
                        time={entry.time}
                        status={entry.status}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
