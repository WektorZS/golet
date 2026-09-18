import assert from "node:assert/strict"
import test from "node:test"

import {
  isValidIsoDate,
  isValidTripDateRange,
  selectInquiryTrip,
} from "../lib/inquiry-validation.ts"

test("wybiera wyjazd po ID, także przy jednakowych nazwach", () => {
  const trips = [
    { id: 1, title: "Ten sam mecz", startDate: "2026-10-01" },
    { id: 2, title: "Ten sam mecz", startDate: "2026-11-01" },
  ]

  assert.equal(selectInquiryTrip(trips, "2"), trips[1])
  assert.equal(selectInquiryTrip(trips, "__other__"), undefined)
})

test("odrzuca niemożliwe daty i respektuje rok przestępny", () => {
  assert.equal(isValidIsoDate("2028-02-29"), true)
  assert.equal(isValidIsoDate("2027-02-29"), false)
  assert.equal(isValidIsoDate("2026-13-01"), false)
  assert.equal(isValidIsoDate("2026-01-32"), false)
  assert.equal(isValidIsoDate("2026-1-1"), false)
})

test("data zakończenia nie może poprzedzać rozpoczęcia", () => {
  assert.equal(isValidTripDateRange("2026-10-01", "2026-10-02"), true)
  assert.equal(isValidTripDateRange("2026-10-01", "2026-10-01"), true)
  assert.equal(isValidTripDateRange("2026-10-02", "2026-10-01"), false)
  assert.equal(isValidTripDateRange("", ""), true)
})
