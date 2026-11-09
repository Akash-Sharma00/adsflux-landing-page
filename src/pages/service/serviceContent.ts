import type { ServiceDetail } from './types'

/**
 * Service-page copy, keyed by service slug (@/config/services). Describes scope and way of working only —
 * no results, client names or numbers. Review with the team before launch; FAQ answers state how Adsflux works.
 */
export const serviceDetails: Readonly<Record<string, ServiceDetail>> = {
  'digital-marketing-strategy': {
    punch: { text: 'A plan built on', emphasis: 'audience truth.' },
    intro:
      'Most brands don’t need more channels. They need a clear reason to be chosen, and a plan that puts budget where it works hardest. We research your audience, market and competitors, then build a growth strategy your team can actually run.',
    included: [
      {
        title: 'Market & audience research',
        description:
          'Interviews, search and social listening, and category analysis to find what your buyers already believe — and what would change their mind.',
      },
      {
        title: 'Channel planning',
        description:
          'Which channels to own, which to test and which to skip, with budgets split by job: building demand, capturing it and keeping customers.',
      },
      {
        title: 'Go-to-market',
        description:
          'Launch plans for new brands, products and markets — positioning, offer, sequencing and the creative each stage needs.',
      },
      {
        title: 'Measurement frameworks',
        description:
          'The few numbers that matter, how to track them across ad platforms and your store, and how to read them honestly.',
      },
    ],
    process: [
      {
        title: 'Listen',
        description: 'A kickoff on goals, constraints and what has been tried, then research into audience, category and competitors.',
      },
      {
        title: 'Plan',
        description:
          'A written strategy: positioning, priority audiences, channel roles, budget split, creative direction and measures of success.',
      },
      {
        title: 'Run it',
        description: 'Your team runs the plan with our playbook, or we stay on to deliver the media, creative and content it calls for.',
      },
    ],
    faqs: [
      {
        question: 'What do we get from a strategy engagement?',
        answer:
          'A written growth strategy covering audience, positioning, channel roles, budget split, creative direction and measurement, plus a working session to walk your team through it.',
      },
      {
        question: 'Do you only write the plan, or carry it out too?',
        answer:
          'Either. Some brands hand the plan to their in-house team; others ask us to run the performance, creative and content work it recommends.',
      },
      {
        question: 'Do you work with brands outside India?',
        answer: 'Yes. We work with brands across India and internationally, including Indian brands entering new markets.',
      },
    ],
  },

  'performance-marketing': {
    punch: { text: 'Spend that', emphasis: 'earns its keep.' },
    intro:
      'We run paid media on Meta, Google and programmatic for brands that need growth they can measure. Creative, targeting and landing pages are planned together, because the ad that wins the auction still has to win the click and the sale.',
    included: [
      {
        title: 'Meta & Google Ads',
        description:
          'Account structure, audiences, bidding and budgets across Facebook, Instagram, Search, Shopping, Performance Max and YouTube.',
      },
      {
        title: 'Programmatic',
        description: 'Display, video and connected TV bought programmatically when reach beyond the big platforms is worth paying for.',
      },
      {
        title: 'Conversion optimisation',
        description: 'Landing pages, offers and checkout flows tested so more of the traffic you pay for turns into customers.',
      },
      {
        title: 'Attribution',
        description:
          'Tracking set up properly — pixels, server-side events and analytics — so you can see which spend actually drives revenue.',
      },
    ],
    process: [
      {
        title: 'Audit',
        description:
          'We review your accounts, tracking, creative and funnel, and agree targets such as cost per acquisition or return on ad spend.',
      },
      {
        title: 'Launch',
        description: 'A cleaner account structure, fresh creative to test and reliable tracking, rolled out in stages so each change can be measured.',
      },
      {
        title: 'Optimise',
        description: 'Ongoing tests of creative, audiences and bids, with reports that show what moved and what changes next.',
      },
    ],
    faqs: [
      {
        question: 'Which ad platforms do you manage?',
        answer:
          'Meta (Facebook and Instagram), Google (Search, Shopping, Performance Max and YouTube) and programmatic display and video. We recommend the mix your goals and budget support.',
      },
      {
        question: 'Do you make the ad creative too?',
        answer: 'Yes. Our creative and UGC teams produce ads built for testing, so fresh creative is never the bottleneck.',
      },
      {
        question: 'How do you measure performance marketing?',
        answer:
          'Against the targets agreed at the start — usually cost per acquisition or return on ad spend — using tracking we check and fix before scaling spend.',
      },
    ],
  },

  'ugc-influencer-marketing': {
    punch: { text: 'Creators who', emphasis: 'stop the scroll.' },
    intro:
      'People trust people more than brands. We find creators who fit your audience, brief them well and turn their content into ads that sell — with briefs, approvals and campaigns run through Scalvo, our creator workspace.',
    included: [
      {
        title: 'Creator sourcing',
        description: 'Creators and influencers matched to your audience, category and budget — from everyday UGC creators to known names.',
      },
      {
        title: 'UGC production',
        description: 'Briefs, scripts, hooks and edits for short-form video that feels native to Reels, Shorts and Stories.',
      },
      {
        title: 'Campaign management',
        description: 'Contracts, product seeding, approvals and timelines handled end to end, so your team only reviews the work.',
      },
      {
        title: 'Whitelisting',
        description: 'Creator content run as paid ads from the creator’s own handle, with usage rights agreed up front.',
      },
    ],
    process: [
      {
        title: 'Brief',
        description: 'We define the audience, the message and the formats, and write the brief creators work from.',
      },
      {
        title: 'Match & make',
        description: 'You approve a shortlist of creators, they shoot to the brief, and we review every cut before it goes live.',
      },
      {
        title: 'Amplify',
        description: 'The strongest pieces run as posts and paid ads, and what we learn shapes the next round of briefs.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between UGC and influencer marketing?',
        answer:
          'UGC creators make content for your brand to post and advertise with; influencers post to their own audience. Most programmes use both — UGC for ads, influencers for reach and credibility.',
      },
      {
        question: 'What is Scalvo?',
        answer:
          'Scalvo is the creator-campaign workspace brands use to work with Adsflux. Each brand gets its own workspace to brief creators, approve content and follow campaigns.',
      },
      {
        question: 'Can creator content run as paid ads?',
        answer:
          'Yes. Usage rights are agreed with each creator before production, so the best content can run as ads — from your handle or, with whitelisting, from theirs.',
      },
    ],
  },

  'creative-video-production': {
    punch: { text: 'Creative made', emphasis: 'to perform.' },
    intro:
      'We make campaign films, ad creative, motion and photography for brands that want work people choose to watch. Every piece is planned for where it will run, so it holds up on a phone, in a feed and on a big screen.',
    included: [
      {
        title: 'Campaign films',
        description: 'Brand and product films from concept and script to shoot, edit, sound and grade.',
      },
      {
        title: 'Ad creative',
        description: 'Static, carousel and short-form video ads made in sets, with hooks and formats built for testing.',
      },
      {
        title: 'Motion design',
        description: 'Animated explainers, product motion, titles and social cut-downs that keep a brand moving.',
      },
      {
        title: 'Photography',
        description: 'Product, lifestyle and campaign photography art-directed to sit with your films and your brand.',
      },
    ],
    process: [
      {
        title: 'Concept',
        description: 'Ideas, scripts and storyboards built from the brief and the channels the work will run on.',
      },
      {
        title: 'Production',
        description: 'Casting, locations, shoot and post-production, with review rounds at the points that matter.',
      },
      {
        title: 'Versioning',
        description: 'Every hero piece cut into the ratios, lengths and variations each platform needs.',
      },
    ],
    faqs: [
      {
        question: 'Do you only make video?',
        answer: 'No. We also produce static and carousel ads, motion design and photography — whatever the campaign needs.',
      },
      {
        question: 'Which formats do you deliver?',
        answer:
          'Each piece comes in the ratios and lengths its platforms need — 9:16 for Reels and Shorts, 1:1 and 4:5 for feeds, 16:9 for YouTube and the web.',
      },
      {
        question: 'Can you make creative for our performance campaigns?',
        answer:
          'Yes. Ad creative is made in sets with different hooks and formats, so performance teams — ours or yours — always have enough to test.',
      },
    ],
  },

  branding: {
    punch: { text: 'Identities with', emphasis: 'a point of view.' },
    intro:
      'A brand is the reason someone picks you before comparing prices. We define what you stand for, name it if needed, and design an identity system your team can use every day — from packaging to performance ads.',
    included: [
      {
        title: 'Positioning',
        description: 'Who you are for, what you promise and why it is believable — written so it guides every decision after it.',
      },
      {
        title: 'Naming',
        description: 'Brand, product and range names, checked for meaning, availability and how they sound out loud.',
      },
      {
        title: 'Visual identity',
        description: 'Logo, colour, type, imagery and motion, designed as a system rather than a single mark.',
      },
      {
        title: 'Brand guidelines',
        description: 'Clear rules and ready-to-use templates, so in-house teams and partners keep the brand consistent.',
      },
    ],
    process: [
      {
        title: 'Discover',
        description: 'Workshops and research into your audience, category and competitors to find the space you can own.',
      },
      {
        title: 'Define',
        description: 'Positioning, personality and messaging agreed before any design starts.',
      },
      {
        title: 'Design',
        description: 'Identity routes, refinement and a full system, tested on real applications: packaging, social, ads and the web.',
      },
    ],
    faqs: [
      {
        question: 'Do you rebrand existing businesses as well as launch new ones?',
        answer:
          'Yes. We build brands from scratch and rework existing ones — from a full rebrand to a refresh that keeps the recognition you have already built.',
      },
      {
        question: 'What is included in a brand identity?',
        answer:
          'Typically a logo, colour palette, typography, imagery direction and brand guidelines, plus templates for the channels you use most.',
      },
      {
        question: 'How does branding connect to marketing?',
        answer:
          'We design identities to work in ads, feeds and stores, not just presentations — so the brand holds up in performance campaigns from day one.',
      },
    ],
  },

  'social-media-marketing': {
    punch: { text: 'Social that', emphasis: 'builds culture.' },
    intro:
      'Posting every day is easy; being worth following is not. We plan, make and run social for brands that want an audience, not just a calendar — on Instagram, YouTube, LinkedIn and wherever your customers spend time.',
    included: [
      {
        title: 'Content strategy',
        description: 'Pillars, formats and a posting rhythm built around what your audience wants and what your brand can credibly say.',
      },
      {
        title: 'Community',
        description: 'Comments, DMs and conversations handled in your brand’s voice, with anything sensitive flagged to your team.',
      },
      {
        title: 'Social-first creative',
        description: 'Reels, carousels, stories and shorts made for the feed — native, quick and recognisably yours.',
      },
      {
        title: 'Reporting',
        description: 'Regular reports on reach, engagement and what drove them, with the changes we will make next.',
      },
    ],
    process: [
      {
        title: 'Plan',
        description: 'An audit of your channels and competitors, then a content strategy and calendar you approve.',
      },
      {
        title: 'Make',
        description: 'Shoots, design and edits produced in batches, with room left for trends and cultural moments.',
      },
      {
        title: 'Run & learn',
        description: 'Publishing, community management and reporting, with the plan adjusted to what performs.',
      },
    ],
    faqs: [
      {
        question: 'Which platforms do you manage?',
        answer: 'Instagram, YouTube, LinkedIn and Facebook, chosen by where your audience actually spends time.',
      },
      {
        question: 'Do you create the content or just post it?',
        answer: 'Both. We plan, shoot, design and edit the content, then publish it and manage the community around it.',
      },
      {
        question: 'How is organic social different from paid ads?',
        answer:
          'Organic social builds the audience and the brand; paid ads buy reach and conversions. We plan them together so the best organic posts can run as ads.',
      },
    ],
  },

  'seo-content-marketing': {
    punch: { text: 'Visibility that', emphasis: 'compounds.' },
    intro:
      'Ads stop when the budget stops; search keeps working. We fix the technical foundations, plan content around what your customers search for, and publish work good enough to earn links and rankings over time.',
    included: [
      {
        title: 'Technical SEO',
        description: 'Site audits, page speed, crawlability, structured data and clear fixes your developers can ship.',
      },
      {
        title: 'Content strategy',
        description: 'Keyword and topic research mapped to the questions buyers ask at each stage, from first search to purchase.',
      },
      {
        title: 'Editorial production',
        description: 'Articles, guides, landing pages and product copy, written by specialists and edited for search and for people.',
      },
      {
        title: 'Link earning',
        description: 'Research, stories and digital PR that other sites want to cite — earned links, never bought ones.',
      },
    ],
    process: [
      {
        title: 'Audit',
        description: 'A technical and content audit of your site and competitors, with fixes ranked by impact.',
      },
      {
        title: 'Plan',
        description: 'A keyword map and content calendar tied to your products, services and markets.',
      },
      {
        title: 'Publish & grow',
        description: 'Content produced, published and improved over time, with rankings and organic traffic reported.',
      },
    ],
    faqs: [
      {
        question: 'How long does SEO take to work?',
        answer:
          'Technical fixes can help within weeks, but content and links usually take several months to build momentum. SEO is a long-term channel, and we plan it that way.',
      },
      {
        question: 'Do you write the content?',
        answer:
          'Yes. Our writers and editors produce articles, guides and landing pages, working with your experts where subject knowledge matters.',
      },
      {
        question: 'Can you work on our existing website?',
        answer:
          'Yes. We audit and improve the site you already have, and brief your developers on the technical changes it needs.',
      },
    ],
  },

  'ai-creative': {
    punch: { text: 'Faster tests,', emphasis: 'human taste.' },
    intro:
      'AI makes more versions, faster; taste decides which ones are worth running. We use AI tools to produce and test ad variations at a pace a traditional studio can’t match, with every piece directed and checked by people.',
    included: [
      {
        title: 'Creative automation',
        description: 'Templates and pipelines that turn one approved idea into every size, format and offer your channels need.',
      },
      {
        title: 'Variant testing',
        description: 'Hooks, visuals and copy varied systematically, so tests show what actually moves results.',
      },
      {
        title: 'AI-assisted production',
        description: 'Image, video, voice and copy tools used where they save time — backgrounds, cut-downs, resizing and more.',
      },
      {
        title: 'Workflow design',
        description: 'Processes and tools set up so your team can brief, generate, review and approve AI-assisted creative safely.',
      },
    ],
    process: [
      {
        title: 'Direct',
        description: 'Creative directors set the idea, the look and the guard rails before any tool is used.',
      },
      {
        title: 'Generate',
        description: 'AI tools produce variations at scale; people select, refine and finish the ones worth running.',
      },
      {
        title: 'Test & learn',
        description: 'Variants run against each other, and the results feed straight into the next round.',
      },
    ],
    faqs: [
      {
        question: 'Will AI-made ads look generic?',
        answer:
          'Not when they are directed. Every idea, look and final piece is chosen and finished by our creative team; AI handles the repetitive work.',
      },
      {
        question: 'Is AI creative safe for our brand?',
        answer: 'We work within your brand guidelines and a person reviews every asset before it runs.',
      },
      {
        question: 'How does AI creative connect to Scalvo?',
        answer:
          'AI-powered creative runs through Scalvo, the workspace brands use with Adsflux, so briefs, versions and approvals live in one place.',
      },
    ],
  },
}
