import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Database, Globe, Container, Play, ArrowRight } from 'lucide-react';

export const SetupGuideSection: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Live REST API Playground State
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/bookings/lock-seats');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('POST');
  const [apiPayload, setApiPayload] = useState<string>(
    JSON.stringify({ showtimeId: 'st-101', seats: [{ id: 'C-5', tier: 'premium' }] }, null, 2)
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);

  const handleTestApi = () => {
    setIsExecutingApi(true);
    setTimeout(() => {
      setIsExecutingApi(false);
      if (apiEndpoint.includes('lock-seats')) {
        setApiResponse(
          JSON.stringify(
            {
              success: true,
              message: 'Seats [C-5] locked in MongoDB session for 300 seconds',
              expiresAt: new Date(Date.now() + 300000).toISOString(),
              mutexToken: 'MTX-99a81c-ACID'
            },
            null,
            2
          )
        );
      } else if (apiEndpoint.includes('movies')) {
        setApiResponse(
          JSON.stringify(
            {
              success: true,
              count: 4,
              data: [
                { id: 'mov-1', title: 'Interstellar Odyssey', rating: 9.4, formats: ['IMAX 3D'] },
                { id: 'mov-2', title: 'Chroma: Noir', rating: 8.9, formats: ['Dolby Atmos'] }
              ]
            },
            null,
            2
          )
        );
      } else {
        setApiResponse(
          JSON.stringify(
            {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              user: { email: 'sarah.connor@example.com', role: 'customer' }
            },
            null,
            2
          )
        );
      }
    }, 450);
  };

  const envSample = `# Express.js Server Port
PORT=5000
NODE_ENV=production

# MongoDB Atlas Distributed Cluster
MONGO_URI=mongodb+srv://imovies_admin:<password>@cluster0.imovies.mongodb.net/imovies_db?retryWrites=true&w=majority&maxPoolSize=50

# JWT Authentication Secret & Expiration
JWT_SECRET=super_secret_high_entropy_jwt_key_2026
JWT_EXPIRES_IN=7d

# Redis Distributed Cache & Concurrency Lock
REDIS_URL=redis://default:<password>@redis-cluster.internal:6379

# Concurrency Locking Duration (seconds)
SEAT_LOCK_DURATION_SECONDS=300

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_live_51P8x...
STRIPE_WEBHOOK_SECRET=whsec_99a...

# Cloudinary Media CDN
CLOUDINARY_CLOUD_NAME=imovies-media
CLOUDINARY_API_KEY=827189283718293
CLOUDINARY_API_SECRET=x99a_...`;

  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/imovies_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: always

  mongo:
    image: mongo:7.0
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7.2-alpine
    restart: always
    ports:
      - "6379:6379"

volumes:
  mongo_data:`;

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
          <span>DEPLOYMENT & DEVOPS ENGINEERING</span>
          <span aria-hidden="true">·</span>
          <span>INSTALLATION, DATABASE CONFIGURATION & DOCKER CLUSTERING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System Setup, Database & Deployment Guide
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive step-by-step documentation for developers and DevOps engineers to provision local development instances or deploy high-availability production clusters across Docker, Nginx, and MongoDB Atlas.
        </p>
      </div>

      {/* SECTION 1: SYSTEM REQUIREMENTS & PREREQUISITES */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-amber-400" />
          <span>1. Installation Requirements & Prerequisites</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Runtime</span>
            <h4 className="text-sm font-bold text-white">Node.js 18.x or 22.x LTS</h4>
            <p className="text-xs text-slate-400">ESModules, native fetch & crypto support.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Database</span>
            <h4 className="text-sm font-bold text-white">MongoDB 6.0+ or Atlas</h4>
            <p className="text-xs text-slate-400">Multi-document ACID transactions & TTL indices.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">In-Memory Cache</span>
            <h4 className="text-sm font-bold text-white">Redis 7.x (Optional)</h4>
            <p className="text-xs text-slate-400">Sub-millisecond distributed mutex seat locks.</p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Package Manager</span>
            <h4 className="text-sm font-bold text-white">npm / pnpm / yarn</h4>
            <p className="text-xs text-slate-400">Dependency tree resolution and script hooks.</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUICKSTART COMMANDS */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span>2. Local Development Quickstart</span>
        </h3>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <span>Terminal Commands</span>
            <button
              onClick={() =>
                copyToClipboard(
                  `git clone https://github.com/imovies/imovies-platform.git\ncd imovies-platform\nnpm install\ncp .env.example .env\nnpm run seed\nnpm run dev`,
                  'quickstart'
                )
              }
              className="hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Sequence</span>
            </button>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="text-slate-500"># 1. Clone the repository and navigate into project directory</div>
            <div className="text-amber-300">$ git clone https://github.com/imovies/imovies-platform.git</div>
            <div className="text-amber-300">$ cd imovies-platform</div>

            <div className="text-slate-500 pt-2"># 2. Install production and development dependencies</div>
            <div className="text-amber-300">$ npm install</div>

            <div className="text-slate-500 pt-2"># 3. Configure environment variables from template</div>
            <div className="text-amber-300">$ cp .env.example .env</div>

            <div className="text-slate-500 pt-2"># 4. Populate database with sample movies, showtimes & auditoriums</div>
            <div className="text-amber-300">$ npm run seed</div>

            <div className="text-slate-500 pt-2"># 5. Launch Express API server and Vite client</div>
            <div className="text-emerald-400">$ npm run dev</div>
            <div className="text-slate-500">&gt; IMovies API listening at http://localhost:5000</div>
            <div className="text-slate-500">&gt; React Client running at http://localhost:3000</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ENVIRONMENT CONFIGURATION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>3. Environment Configuration (.env)</span>
          </h3>

          <button
            onClick={() => copyToClipboard(envSample, 'env')}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy .env Template</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            <code>{envSample}</code>
          </pre>
        </div>
      </section>

      {/* SECTION 4: PRODUCTION DOCKER DEPLOYMENT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Container className="w-5 h-5 text-amber-400" />
            <span>4. Production Deployment with Docker Compose</span>
          </h3>

          <button
            onClick={() => copyToClipboard(dockerCompose, 'docker')}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy docker-compose.yml</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed">
            <code>{dockerCompose}</code>
          </pre>
        </div>
      </section>

      {/* SECTION 5: LIVE REST API PLAYGROUND */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <span>5. Interactive REST API Endpoint Tester</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Test simulated API calls directly against the Express controller schema.
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={apiMethod}
              onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST')}
              className="bg-slate-950 text-amber-400 font-mono font-bold text-xs border border-slate-800 rounded-lg px-3 py-2"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>

            <select
              value={apiEndpoint}
              onChange={(e) => {
                setApiEndpoint(e.target.value);
                if (e.target.value.includes('movies')) {
                  setApiMethod('GET');
                  setApiPayload('{}');
                } else if (e.target.value.includes('login')) {
                  setApiMethod('POST');
                  setApiPayload(JSON.stringify({ email: 'sarah.connor@example.com', password: '••••••••' }, null, 2));
                } else {
                  setApiMethod('POST');
                  setApiPayload(JSON.stringify({ showtimeId: 'st-101', seats: [{ id: 'C-5', tier: 'premium' }] }, null, 2));
                }
              }}
              className="flex-1 bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 rounded-lg px-3 py-2"
            >
              <option value="/api/bookings/lock-seats">/api/bookings/lock-seats (Distributed Mutex)</option>
              <option value="/api/movies/now-playing">/api/movies/now-playing (Catalog Query)</option>
              <option value="/api/auth/login">/api/auth/login (JWT Generation)</option>
            </select>

            <button
              onClick={handleTestApi}
              disabled={isExecutingApi}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              {isExecutingApi ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Sending Request...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Execute Request</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                JSON Request Payload
              </span>
              <textarea
                value={apiPayload}
                onChange={(e) => setApiPayload(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Live HTTP Response (Status 200 OK)
              </span>
              <pre className="w-full h-[126px] bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-300 overflow-y-auto">
                {apiResponse || '// Click "Execute Request" above to test endpoint'}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
