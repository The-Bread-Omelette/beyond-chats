import logger from '../utils/logger.js';

class CircuitBreaker {
  constructor(name, options = {}) {
    this.name = name;
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker [${this.name}] is OPEN`);
      }
      this.state = 'HALF_OPEN';
      logger.info(`Circuit breaker [${this.name}] entering HALF_OPEN state`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.lastFailureTime = null;
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info(`Circuit breaker [${this.name}] closed after successful attempt`);
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      logger.warn(
        `Circuit breaker [${this.name}] opened after ${this.failureCount} failures. ` +
        `Will retry after ${this.timeout}ms`
      );
    }
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

export default CircuitBreaker;