export class Timer {
  constructor(duration = 60) {
    this.duration = duration;
    this.remaining = duration;
    this.intervalId = null;
    this.startTime = null;
    this.elapsedTime = 0;
    this.onTick = null;
    this.onComplete = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now() - this.elapsedTime * 1000;
    this.intervalId = setInterval(() => {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
      this.remaining = Math.max(0, this.duration - this.elapsedTime);
      if (this.onTick) {
        this.onTick(this.remaining, this.elapsedTime);
      }
      if (this.remaining <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 100);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  reset() {
    this.stop();
    this.remaining = this.duration;
    this.elapsedTime = 0;
    this.startTime = null;
  }

  setDuration(duration) {
    this.duration = duration;
    this.remaining = duration;
  }

  getRemaining() {
    return this.remaining;
  }

  getElapsed() {
    return this.elapsedTime;
  }
}
