import type { APIRoute } from 'astro';
import raw from '../../../facts.md?raw';

// The docs in full. Today that is facts.md, verbatim; the quickstart and other
// docs pages append here as they land.
export const GET: APIRoute = () =>
  new Response(raw, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
