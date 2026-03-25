// Extends Vitest's expect with jest-dom matchers
// e.g. toBeInTheDocument(), toHaveValue(), toBeDisabled()
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'
expect.extend(matchers)
