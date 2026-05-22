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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-[640px] flex-col rounded-[1.75rem] bg-surface-container-lowest shadow-[0_28px_80px_-28px_rgba(15,23,42,0.45)]">
        <div className="flex-shrink-0 px-7 pt-8 pb-5 sm:px-8 sm:pt-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 className="text-3xl font-extrabold leading-none text-on-surface font-headline">
              {parentTitle}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="-mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high active:scale-95"
              aria-label="Cerrar catalogo"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          </div>
          <p className="text-lg text-on-surface-variant">
            Selecciona el espacio que deseas reservar
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-8 sm:px-8">
          <div className="flex flex-col gap-4">
            {subSpaces.map((sub) => (
              <div
                key={sub.value}
                className="flex min-h-[94px] items-center gap-5 rounded-[1.125rem] bg-surface-container-low px-5 py-4"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  <span className="material-symbols-outlined text-[30px]">{sub.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold leading-tight text-on-surface font-headline">
                    {sub.title}
                  </h3>
                  <p className="mt-1 max-w-[330px] text-base leading-tight text-on-surface-variant">
                    {sub.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(sub)}
                  className="flex-shrink-0 rounded-[0.9rem] bg-primary px-5 py-3.5 text-base font-extrabold text-on-primary transition-all hover:bg-primary-container active:scale-95"
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
