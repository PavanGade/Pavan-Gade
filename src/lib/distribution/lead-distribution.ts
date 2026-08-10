export function pickNextOwner(agentIds: string[], lastIndex: number): { ownerId: string; nextIndex: number } {
  if (agentIds.length === 0) {
    throw new Error("At least one eligible agent is required.");
  }

  const nextIndex = (lastIndex + 1) % agentIds.length;
  return {
    ownerId: agentIds[nextIndex],
    nextIndex,
  };
}
