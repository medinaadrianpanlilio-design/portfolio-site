import { site } from './site'
import type {
  EngineeringNote,
  LoopStep,
  Measurement,
  RetentionPanel,
  WeatherEvent,
} from './types'

export const skySprout = {
  name: 'SkySprout',
  listingName: 'Sky Sprout',
  handle: 'BretRackstar',
  tagline: 'A floating garden that grows while you’re away.',
  meta: 'Built solo in Roblox and Luau. Live since October 2026.',
  proof: '50+ server specs and 130+ commits.',
  liveUrl: site.skySproutUrl,
  loop: [
    { label: 'Buy seeds', detail: 'Start with 100 coins and seven plots.' },
    {
      label: 'Plant',
      detail: 'Every player gets a garden on their own floating island.',
    },
    {
      label: 'Grow',
      detail: 'Growth is calculated from a server timestamp, not a client timer.',
    },
    {
      label: 'Harvest',
      detail: 'The server hands over the weight and mutations it already recorded.',
    },
    {
      label: 'Sell or exhibit',
      detail: 'Cash out, or move a specimen to the Living Garden.',
    },
    {
      label: 'Earn and expand',
      detail: 'Passive income funds more plots, trees, and pedestals.',
    },
  ] satisfies LoopStep[],
  tutorialSteps: ['Buy', 'Plant', 'Harvest', 'Sell', 'Exhibit'],
  weatherEvents: [
    { name: 'Snow & Wind', mutation: 'Wind', multiplier: '1.5×' },
    { name: 'Lightning Storm', mutation: 'Thunder', multiplier: '3×' },
    { name: 'Cosmic Surge', mutation: 'Cosmic', multiplier: '8×' },
  ] satisfies WeatherEvent[],
  goldenMutation: 'Golden',
  retention: [
    {
      id: 'tutorial',
      title: 'A five-step tutorial',
      body: 'Buy, plant, harvest, sell, exhibit. Completing it grants +100 coins and a two-minute 2× coin boost.',
      stat: '+100',
      statLabel: 'coins on completion',
    },
    {
      id: 'offline',
      title: 'The garden keeps growing',
      body: 'Crops mature while you are away. Returning players can claim up to 12 hours of passive income and harvest a ripe garden.',
      stat: '12h',
      statLabel: 'offline income cap',
    },
    {
      id: 'weather',
      title: 'The sky changes the crop',
      body: 'A global 44-minute cycle brings Wind, Thunder, and Cosmic events. Mutations stack multiplicatively; Golden is the baseline rare roll.',
      stat: '44 min',
      statLabel: 'global weather cycle',
    },
  ] satisfies RetentionPanel[],
  engineering: [
    {
      title: 'Server authority',
      body: 'Growth stages, coin grants, and mutation rolls are decided by the server, never by a client timer.',
    },
    {
      title: 'Persistence that fails safe',
      body: 'Versioned DataStore records save coins, plots, pedestals, and inventory. If a load fails, the session goes read-only instead of overwriting progress.',
    },
    {
      title: 'One shared clock',
      body: 'Weather timing comes from server time modulo the 44-minute cycle, so every server sees the same event.',
    },
    {
      title: 'Tested systems',
      body: 'More than 50 server spec files cover growth, economy, inventory, persistence, and visitor safety.',
    },
  ] satisfies EngineeringNote[],
  measurements: [
    {
      label: 'Tutorial completion',
      body: 'How many first-time players finish the five steps?',
    },
    {
      label: 'Day-1 and day-7 return',
      body: 'Do players come back after the first session?',
    },
    {
      label: 'Session length',
      body: 'How long does a farming or exhibition session last?',
    },
    {
      label: 'Weather participation',
      body: 'Are players harvesting during event windows?',
    },
    {
      label: 'Mutation collection',
      body: 'How many distinct mutations does a player collect?',
    },
    {
      label: 'First purchase',
      body: 'Does the 2× offline claim convert without feeling forced?',
    },
  ] satisfies Measurement[],
} as const
