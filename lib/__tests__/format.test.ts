import { formatCurrency, initials } from '@/lib/format';

describe('format helpers', () => {
  it('formats currency from cents', () => {
    expect(formatCurrency(4800000, 'USD')).toContain('48');
  });

  it('builds initials', () => {
    expect(initials('Arjun Mehta')).toBe('AM');
  });
});
