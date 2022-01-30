export default function housekeeping(db) {
  // Define clean-up method.
  const day = 24 * 60 * 60 * 1000;
  const cleanStaleMatches = async () => {
    const dayAgo = Date.now() - 1 * day;
    // Retrieve matchIDs for matches unchanged for > 1 week.
    const staleMatchIDs = await db.listMatches({
      where: {
        updatedBefore: dayAgo,
      },
    });
    // Delete matches one-by-one. Could also use a queue or parallel system here.
    for (const id of staleMatchIDs) {
      await db.wipe(id);
    }
  }

  // Schedule clean-up.
  setInterval(cleanStaleMatches, day);
}
