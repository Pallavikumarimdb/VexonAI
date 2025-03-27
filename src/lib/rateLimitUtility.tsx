
export class RateLimiter {
    private requests: number[] = [];
    private MAX_REQUESTS = 10;
    private RATE_WINDOW = 60 * 1000; 

    async executeWithRateLimit<T>(task: () => Promise<T>): Promise<T> {
        const now = Date.now();
        
        this.requests = this.requests.filter(
            time => now - time < this.RATE_WINDOW
        );

        if (this.requests.length >= this.MAX_REQUESTS) {
            const oldestRequestTime = this.requests[0];
            if (oldestRequestTime !== undefined) {
                const waitTime = this.RATE_WINDOW - (now - oldestRequestTime);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        try {
            this.requests.push(Date.now());
            return await task();
        } catch (error) {
            console.error("Rate-limited task failed:", error);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            throw error;
        }
    }
}

export const globalRateLimiter = new RateLimiter();