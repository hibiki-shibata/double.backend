// Doc: https://nodejs.org/learn/test-runner/using-test-runner
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

describe('Password Service Test', () => {
    test('Password Generic Test', () =>
        assert.equal('a', 'a')
    )

    test('Password Error Test', () => {
        assert.throws(
            () => {
                throw new TypeError
            },
            TypeError
        )
    })


})