export default {
  extends: [],
  rules: {
    "header-min-length": [2, "always", 10],
    "header-match": [2, "always"],
  },
  plugins: [
    {
      rules: {
        "header-match": ({ header }) => {
          return [
            /^\[(feat|doc|bug|hotfix)\]\s.+$/.test(header),
            "Commit message must start with one of the following tags: [feat], [doc], [bug], or [hotfix].",
          ];
        },
      },
    },
  ],
};
