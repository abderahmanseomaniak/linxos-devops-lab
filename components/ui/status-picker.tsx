import { CircleDashed, X } from 'lucide-react';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface StatusPickerItem {
  id: number;
  emoji: string;
  name: string;
}

interface StatusPickerProps {
  items: StatusPickerItem[];
  value?: number;
  defaultValue?: number;
  color?: string;
  onChange?: (id: number) => void;
}

export const StatusPicker: React.FC<StatusPickerProps> = ({
  items,
  value,
  defaultValue = 0,
  color,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [hoveredIdx, setHoveredIdx] = React.useState(0);
  const [internalStatus, setInternalStatus] = React.useState(defaultValue);

  const isControlled = value !== undefined;
  const status = isControlled ? value : internalStatus;

  const setStatus = (id: number) => {
    if (!isControlled) setInternalStatus(id);
    onChange?.(id);
  };

  const activeItem = items.find((item) => item.id === status);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center justify-center">
        <motion.div
          layout
          className="relative flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[#F4F4F9] px-2.5 py-0.5 dark:bg-zinc-800"
          style={color ? { backgroundColor: color } : undefined}
          onClick={() => {
            setOpen(!open);
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 18,
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div className="relative flex min-w-14 cursor-pointer items-center justify-center gap-1 overflow-hidden">
              <div className="flex items-center justify-center gap-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  {status === 0 ? (
                    <motion.div
                      key="default"
                      className="relative flex size-4 items-center justify-center"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CircleDashed className="size-4 text-neutral-300" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <span className={`flex items-center justify-center text-xs font-medium ${color ? "text-white" : "text-neutral-700 dark:text-zinc-100"}`}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {(status !== 0
                      ? (activeItem?.name.split('') ?? [])
                      : 'Status'.split('')
                    ).map((item, index) => {
                      if (item === ' ') {
                        return (
                          <motion.span
                            key={`${index}-${status}-space`}
                            className="inline-block w-[0.3em]"
                          >
                            &nbsp;
                          </motion.span>
                        );
                      }

                      return (
                        <motion.span
                          key={`${index}-${status}-${item}`}
                            initial={{
                              opacity: 0,
                              y: 5,
                              scale: 0.8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                                delay: index * 0.04,
                              },
                            }}
                            exit={{
                              y: -8,
                              opacity: 0,
                              scale: 0.8,
                            transition: {
                              type: 'spring',
                              stiffness: 300,
                              damping: 25,
                              delay: index * 0.03,
                            },
                          }}
                          className="inline-block tracking-normal"
                        >
                          {item}
                        </motion.span>
                      );
                    })}
                  </AnimatePresence>

                 
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {open && (
              <motion.div
                className="absolute -translate-y-[100%] rounded-3xl border border-gray-100 bg-white p-1 dark:border-white/10 dark:bg-zinc-900"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
              >
                <div className="flex items-center justify-center gap-0.5">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      onMouseEnter={() => {
                        setHoveredIdx(item.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredIdx(0);
                      }}
                      className="group relative flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[#F4F4F9] p-1.5 dark:border-white/10 dark:bg-white/5"
                      whileHover={{ y: -2 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 18,
                      }}
                    >
                      <AnimatePresence mode="popLayout">
                        {hoveredIdx === item.id && (
                          <motion.div
                            className="absolute -top-[40px] left-2 -translate-y-2 rounded-full border border-gray-100 bg-[#F4F4F9] dark:border-white/10 dark:bg-white/5"
                            initial={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 23,
                            }}
                          >
                            <div className="relative flex w-full flex-col items-center px-2 py-1">
                              <div className="text-sm font-medium whitespace-nowrap text-neutral-700 dark:text-zinc-100">
                                {item.name}
                              </div>

                              <div className="absolute -bottom-[12px] left-4">
                                <div className="h-[6px] w-[13px] rounded-b-full border bg-[#F4F4F9] dark:bg-zinc-800" />
                                <div className="size-1.5 -translate-x-[2px] translate-y-[1px] rounded-full border bg-[#F4F4F9] dark:bg-zinc-800" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div
                        className="flex size-6 items-center justify-center transition-all duration-200 ease-in-out group-hover:scale-110"
                        onClick={() => {
                          setStatus(item.id);
                          setOpen(false);
                        }}
                      >
                        <div>{item.emoji}</div>
                      </div>
                    </motion.div>
                  ))}
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[#F4F4F9] dark:bg-zinc-800 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => setOpen(false)}
                  >
                    <X className="size-4 text-neutral-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
