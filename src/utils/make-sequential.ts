import { sleep } from "bun";

interface Options {
  delayMs?: number;
}

type AsyncFunction<Args extends any[] = any[], ReturnType = any> = (
  ...args: Args
) => Promise<ReturnType>;

interface Task<Fn extends AsyncFunction> {
  resolve: (value: Awaited<ReturnType<Fn>>) => void;
  reject: (reason?: any) => void;
  args: Parameters<Fn>;
}

export function makeSequential<Fn extends AsyncFunction>(
  asyncFn: Fn,
  { delayMs = 0 }: Options = {}
): (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>> {
  // Inline types for readability
  type Result = Awaited<ReturnType<Fn>>;
  type Args = Parameters<Fn>;

  const taskQueue: Task<Result>[] = [];

  let processing = false;

  const processQueue = async () => {
    if (processing) {
      return;
    }

    processing = true;

    while (taskQueue.length > 0) {
      const task = taskQueue.shift();

      if (!task) {
        continue;
      }

      try {
        const result = await asyncFn(...task.args);

        task.resolve(result);
        if (delayMs > 0) {
          await sleep(delayMs);
        }
      } catch (error) {
        task.reject(error);
      }
    }

    processing = false;
  };

  return (...args: Args): Promise<Result> => {
    const { promise, resolve, reject } = Promise.withResolvers<Result>();

    taskQueue.push({ resolve, reject, args });

    processQueue(); // Try to start processing if idle

    return promise;
  };
}
