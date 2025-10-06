describe('Utility Functions', () => {
    describe('formatNumber', () => {
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'k';
            }
            return num.toString();
        };
        
        it('should format millions correctly', () => {
            expect(formatNumber(1500000)).toBe('1.5M');
            expect(formatNumber(2000000)).toBe('2.0M');
        });
        
        it('should format thousands correctly', () => {
            expect(formatNumber(1500)).toBe('1.5k');
            expect(formatNumber(2000)).toBe('2.0k');
        });
        
        it('should return number as string for values < 1000', () => {
            expect(formatNumber(999)).toBe('999');
            expect(formatNumber(100)).toBe('100');
        });
    });
    
    describe('shuffleArray', () => {
        const shuffleArray = (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };
        
        it('should return array with same length', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(arr);
            expect(shuffled.length).toBe(arr.length);
        });
        
        it('should contain all original elements', () => {
            const arr = [1, 2, 3, 4, 5];
            const shuffled = shuffleArray(arr);
            arr.forEach(item => {
                expect(shuffled).toContain(item);
            });
        });
        
        it('should not modify original array', () => {
            const arr = [1, 2, 3, 4, 5];
            const original = [...arr];
            shuffleArray(arr);
            expect(arr).toEqual(original);
        });
    });
});
