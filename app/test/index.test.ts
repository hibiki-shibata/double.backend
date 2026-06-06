// Doc: https://nodejs.org/learn/test-runner/using-test-runner
import assert from "node:assert/strict"
import { test } from 'node:test'


test('Index.test.js Test', { concurrency: true }, t => {

    t.test('Fairst line of test', () => assert.equal('a', 'a'))
    // t.test('Fairst line of test', assert.AssertionError new

});