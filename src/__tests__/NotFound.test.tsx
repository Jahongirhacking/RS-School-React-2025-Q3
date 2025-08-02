/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
import { render, screen } from '@testing-library/react';
import { describe, test } from 'vitest';
import NotFoundPage from '../pages/NotFoundPage';

describe('NotFound page', () => {

    beforeEach(() => {
        render(<NotFoundPage />)
    })
    test("Not found page details", async () => {
        expect(screen.getByText(/not found 404/i)).toBeInTheDocument();
    })
});
