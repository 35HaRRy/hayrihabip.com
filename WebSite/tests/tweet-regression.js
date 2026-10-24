// Run with the existing Playwright browser_run_code tool (filename option).
// Fixture API :5059 and a fresh production build on :3100 must be running.
async (page) => {
  const context = await page.context().browser().newContext();
  try {
    await context.route('https://platform.twitter.com/widgets.js', (route) => route.fulfill({
      contentType: 'application/javascript',
      body: `window.twttr = {widgets: {load(container) {
        if (container.querySelector('iframe')) return;
        const link = container.querySelector('blockquote a');
        if (!link) return;
        const frame = document.createElement('iframe');
        frame.dataset.tweetId = link.href.split('/').pop();
        container.replaceChildren(frame);
      }}};`,
    }));
    await context.route('https://*.disqus.com/**', (route) => route.fulfill({ body: '', contentType: 'application/javascript' }));
    const p = await context.newPage();
    await p.goto('http://127.0.0.1:3100/blog-post/0123456789abcdef01234567');
    await p.locator('iframe[data-tweet-id="1234"]').waitFor();
    await p.getByRole('link', { name: /Sonraki Yazı/ }).click();
    await p.getByRole('heading', { name: 'Second fixture title', exact: true }).waitFor();
    const tweets = await p.locator('iframe[data-tweet-id]').evaluateAll((frames) => frames.map((frame) => frame.dataset.tweetId));
    if (!tweets.includes('5678') || tweets.includes('1234')) throw new Error(`Expected B tweet 5678 without A tweet 1234, got ${tweets.join(',')}`);
    return { replacesTransformedTweetOnPostChange: true, tweets };
  } finally { await context.close(); }
}
