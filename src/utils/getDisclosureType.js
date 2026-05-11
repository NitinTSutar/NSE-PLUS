export function getDisclosureType(data) {
  if (data.TypeOfSecuritiesProposedToBeIssuedUnderPreferentialIssue) {
    return "preferential_issue";
  }

  if (data.TypeOfMeeting || data.DateOfProposedMeeting) {
    return "board_meeting";
  }

  return "unknown";
}
