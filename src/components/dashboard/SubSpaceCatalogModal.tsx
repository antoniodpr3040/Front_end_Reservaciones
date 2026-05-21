import type { SubSpaceItem } from '../../types/reservations';

interface SubSpaceCatalogModalProps {
  parentTitle: string;
  subSpaces: SubSpaceItem[];
  onSelect: (subSpace: SubSpaceItem) => void;
  onClose: () => void;
}

export function SubSpaceCatalogModal({
  parentTitle,
  subSpaces,
  onSelect,
  onClose,
}: SubSpaceCatalogModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90dvh] w-full flex-col rounded-t-3xl bg-surface-container-lowest shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex-shrink-0 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <div className="mb-1 flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold text-on-surface font-headline sm:text-2xl">
              {parentTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 rounded-xl p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="text-sm text-on-surface-variant">
            Selecciona el espacio que deseas reservar
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="flex flex-col gap-3">
            {subSpaces.map((sub) => (
              <div
                key={sub.value}
                className="flex items-center gap-4 rounded-2xl bg-surface-container-low p-4"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-fixed-dim/30 text-primary">
                  <span className="material-symbols-outlined text-xl">{sub.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-on-surface font-headline leading-tight">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{sub.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(sub)}
                  className="flex-shrink-0 rounded-xl bg-primary-gradient px-4 py-2.5 text-sm font-bold text-on-primary transition-all active:scale-95"
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
