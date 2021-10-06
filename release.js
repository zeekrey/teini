module.exports = async (markdown, metaData) => {
  const { commits, authors, githubConnection, repoDetails } = metadata;

  console.log(commits);
  throw Error(commit)

  const changelog = buildChangelog(commits)
  return changelog;
};

const buildChangelog = (commits) => {
  let text = "This is the release text";

  console.log(commits)

//   for (const section in sections) {
//     const changes = sections[section];

//     // No changes in this section? Don't render it
//     if (changes.length === 0) {
//       continue;
//     }

//     const title = section === "__fallback" ? fallbackSection : section;
//     text += `### ${title}\n\n`;

//     for (const change of changes) {
//       const numberText = change.number != null ? `: #${change.number}` : "";

//       text += `- ${cleanupPRTitle(change.title)}${numberText}\n`;
//     }

//     text += "\n";
//   }

  return text;
};
