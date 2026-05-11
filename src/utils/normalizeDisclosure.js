const pair = (label, value) => ({ label, value: value ?? "-" });

const baseDisclosure = (data, title, eventDate) => ({
  company: data.NameOfTheCompany || "-",
  symbol: data.NSESymbol || "-",
  isin: data.ISIN || "-",
  title,
  eventDate: eventDate || "-",
  highlights: [],
  details: [],
});

const normalizePreferentialIssue = (data) => {
  const normalized = baseDisclosure(
    data,
    data.TypeOfEvent || "Preferential Issue",
    data.DateOfOccurrenceOfEvent || data.DateOfReport
  );

  normalized.highlights = [
    pair("Total Issue Amount", data.TotalAmountForWhichTheSecuritiesWillBeIssuedUnderPreferentialIssue),
    pair("Issue Price", data.IssuePriceOrAllottedPriceOfPreferentialIssue),
    pair("Total Securities", data.TotalNumberOfSecuritiesProposedToBeIssuedUnderPreferentialIssue),
    pair("Investors", data.NumberOfInvestors),
  ];

  normalized.details = [
    pair("Investor Names", data.NamesOfTheInvestors),
    pair("Pre-Issue Paid-up Capital", data.PaidUpShareCapitalPrePreferentialIssue),
    pair("Post-Issue Paid-up Capital", data.PaidUpShareCapitalPostPreferentialIssue),
    pair("Outcome", data.OutcomeOfTheSubscriptionPostAllotment),
    pair("ISIN", data.ISIN),
  ];

  return normalized;
};

const normalizeBoardMeeting = (data) => {
  const normalized = baseDisclosure(
    data,
    data.TypeOfMeeting || "Board Meeting",
    data.DateOfProposedMeeting || data.DateOfReport
  );

  normalized.highlights = [
    pair("Meeting Type", data.TypeOfMeeting),
    pair("Proposed Date", data.DateOfProposedMeeting),
    pair("Audited Status", data.WhetherResultsAreAuditedOrUnaudited),
    pair("Dividend Type", data.TypeOfDividend),
  ];

  normalized.details = [
    pair("Agenda 1", data.Agenda1),
    pair("Agenda 2", data.Agenda2),
    pair("Period Month", data.MonthOfPeriodEnded),
    pair("Period Year", data.YearOfPeriodEnded),
    pair("Trading Window Closed", data.WhetherTradingWindowIsClosed),
    pair("Report Nature", data.NatureOfReportStandaloneConsolidated),
    pair("ISIN", data.ISIN),
  ];

  return normalized;
};

const normalizeUnknown = (data) => {
  const normalized = baseDisclosure(
    data,
    data.TypeOfEvent || data.TypeOfMeeting || "Disclosure",
    data.DateOfOccurrenceOfEvent || data.DateOfProposedMeeting || data.DateOfReport
  );

  const allEntries = Object.entries(data);
  normalized.highlights = allEntries.slice(0, 6).map(([label, value]) => pair(label, String(value)));
  normalized.details = allEntries.slice(6).map(([label, value]) => pair(label, String(value)));

  return normalized;
};

export function normalizeDisclosure(data, type) {
  if (type === "preferential_issue") {
    return normalizePreferentialIssue(data);
  }

  if (type === "board_meeting") {
    return normalizeBoardMeeting(data);
  }

  return normalizeUnknown(data);
}
