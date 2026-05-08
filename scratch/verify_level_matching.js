const mapLevel = (level, availableLevels) => {
  if (!level) return 'Bachelor'
  const lower = level.toLowerCase()
  
  const exactMatch = availableLevels.find(l => l.name.toLowerCase() === lower)
  if (exactMatch) return exactMatch.name

  const matches = availableLevels.filter(l => {
    const levelNameLower = l.name.toLowerCase()
    return lower.includes(levelNameLower) || levelNameLower.includes(lower)
  })

  if (matches.length > 0) {
    const bestMatch = matches.sort((a, b) => b.name.length - a.name.length)[0]
    return bestMatch.name
  }

  if (lower.includes('bach')) return 'Bachelor'
  if (lower.includes('mast')) return 'Master'
  return 'Bachelor'
}

const levels = [
  { name: 'Bachelor' },
  { name: 'Bachelor without CSA' },
  { name: 'Master' },
  { name: 'PhD' }
]

const testCases = [
  { input: 'Bachelor', expected: 'Bachelor' },
  { input: 'Bachelor without CSA', expected: 'Bachelor without CSA' },
  { input: 'BACHELOR WITHOUT CSA', expected: 'Bachelor without CSA' },
  { input: 'Master of Science', expected: 'Master' },
  { input: 'Ph.D', expected: 'PhD' },
  { input: 'PhD (Doctor of Philosophy)', expected: 'PhD' },
  { input: 'Non-existent', expected: 'Bachelor' }
]

testCases.forEach(tc => {
  const result = mapLevel(tc.input, levels)
  console.log(`Input: "${tc.input}" | Expected: "${tc.expected}" | Result: "${result}" | ${tc.expected === result ? 'PASS' : 'FAIL'}`)
})
