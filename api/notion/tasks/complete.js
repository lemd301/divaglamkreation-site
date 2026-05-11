export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { pageId } = req.body || {};

    if (!pageId) {
      return res.status(400).json({
        success: false,
        message: 'Missing pageId.'
      });
    }

    const notionToken = process.env.NOTION_TOKEN;

    if (!notionToken) {
      return res.status(500).json({
        success: false,
        message: 'Missing NOTION_TOKEN environment variable.'
      });
    }

    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        properties: {
          Status: {
            status: {
              name: 'Done'
            }
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Notion update failed.',
        error: data
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task marked as Done.',
      pageId
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
