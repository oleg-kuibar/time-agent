interface SlackMessage {
  repo: string;
  pr: number;
  reviewer: string;
  timeSpent: number;
  url: string;
}

export async function sendSlackNotification(data: SlackMessage): Promise<void> {
  const minutes = Math.round(data.timeSpent);
  const message = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*PR Review Completed* :white_check_mark:\n*Repository:* ${data.repo}\n*PR #${data.pr}*\n*Reviewer:* ${data.reviewer}\n*Time Spent:* ${minutes} minutes`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View PR"
            },
            url: data.url
          }
        ]
      }
    ]
  };

  const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });

  if (!response.ok) {
    throw new Error(`Failed to send Slack notification: ${response.statusText}`);
  }
} 