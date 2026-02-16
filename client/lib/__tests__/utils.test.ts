import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('должен объединять классы', () => {
    const result = cn('class1', 'class2')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
  })

  it('должен обрабатывать условные классы', () => {
    const result = cn('base', { conditional: true, hidden: false })
    expect(result).toContain('base')
    expect(result).toContain('conditional')
    expect(result).not.toContain('hidden')
  })

  it('должен удалять дубликаты классов', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })

  it('должен обрабатывать undefined и null', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toContain('base')
    expect(result).toContain('end')
  })

  it('должен работать с массивами', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toContain('class1')
    expect(result).toContain('class2')
    expect(result).toContain('class3')
  })
})
