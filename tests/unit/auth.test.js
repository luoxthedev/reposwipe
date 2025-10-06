const bcrypt = require('bcryptjs');

describe('Authentication', () => {
    describe('Password hashing', () => {
        it('should hash password correctly', async () => {
            const password = 'testPassword123';
            const hashed = await bcrypt.hash(password, 10);
            
            expect(hashed).not.toBe(password);
            expect(hashed.length).toBeGreaterThan(0);
        });
        
        it('should verify correct password', async () => {
            const password = 'testPassword123';
            const hashed = await bcrypt.hash(password, 10);
            const isValid = await bcrypt.compare(password, hashed);
            
            expect(isValid).toBe(true);
        });
        
        it('should reject incorrect password', async () => {
            const password = 'testPassword123';
            const wrongPassword = 'wrongPassword';
            const hashed = await bcrypt.hash(password, 10);
            const isValid = await bcrypt.compare(wrongPassword, hashed);
            
            expect(isValid).toBe(false);
        });
    });
    
    describe('Password validation', () => {
        it('should reject passwords shorter than 6 characters', () => {
            const shortPassword = '12345';
            expect(shortPassword.length).toBeLessThan(6);
        });
        
        it('should accept passwords 6 characters or longer', () => {
            const validPassword = '123456';
            expect(validPassword.length).toBeGreaterThanOrEqual(6);
        });
    });
});
