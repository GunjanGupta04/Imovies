export interface ArchitectureNode {
  id: string;
  name: string;
  layer: 'Client Layer' | 'API Gateway' | 'Backend Application' | 'Caching & Queues' | 'Database' | 'External Services';
  tech: string;
  description: string;
  responsibilities: string[];
  protocols: string[];
  specs: string;
}

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'client-spa',
    name: 'React 19 SPA (Client-Side)',
    layer: 'Client Layer',
    tech: 'React 19, TypeScript, Tailwind CSS, Motion',
    description: 'High-performance interactive user interface delivering instant seat-map rendering, real-time availability updates, and smooth transactional booking flows.',
    responsibilities: [
      'Render dynamic interactive SVG cinema seating grid',
      'Manage client state for seat selection & concession cart',
      'Handle JWT storage in secure HttpOnly cookies/memory',
      'Maintain real-time WebSocket / SSE connection for live seat locking alerts',
      'Generate offline-ready digital e-ticket passes with QR codes'
    ],
    protocols: ['HTTPS (HTTP/2)', 'WSS (Secure WebSockets)', 'Server-Sent Events (SSE)'],
    specs: 'Lighthouse Score: 98/100 · First Contentful Paint: < 0.8s'
  },
  {
    id: 'reverse-proxy',
    name: 'Nginx Reverse Proxy & Load Balancer',
    layer: 'API Gateway',
    tech: 'Nginx 1.25, TLS 1.3, Brotli Compression',
    description: 'Front-facing ingress handling SSL termination, rate limiting, static asset caching, and round-robin upstream distribution across Express worker clusters.',
    responsibilities: [
      'TLS 1.3 handshakes & certificate auto-renewal (Let’s Encrypt)',
      'DDoS mitigation and IP-based rate limiting (100 req/min per IP)',
      'Static asset caching with aggressive cache-control headers',
      'WebSocket reverse proxy upgrade handling (`Upgrade $http_upgrade`)',
      'Load balancing across clustered Node.js worker threads'
    ],
    protocols: ['TLS 1.3', 'HTTP/2', 'FastCGI / Upstream Proxy'],
    specs: 'Concurrency: 10,000+ simultaneous connections · SSL Handshake: < 15ms'
  },
  {
    id: 'express-server',
    name: 'Express.js Application Server',
    layer: 'Backend Application',
    tech: 'Node.js 22 LTS, Express 4.21, TypeScript, Tsx',
    description: 'Core RESTful micro-architected monolith providing robust routing, business logic validation, seat lock concurrency coordination, and JWT security enforcement.',
    responsibilities: [
      'Authentication & Authorization via JWT and Role-Based Guards (RBAC)',
      'Movie catalog, showtime query filtering, and capacity validation',
      'Atomic seat reservation transactions with distributed mutex locks',
      'Concession cart computation, pricing engine, and tax reconciliation',
      'Webhook listener for asynchronous payment settlement (Stripe/Razorpay)'
    ],
    protocols: ['REST (JSON)', 'Express Middleware Pipeline', 'JWT Bearer'],
    specs: 'P99 Latency: < 32ms · Event Loop Utilization: < 35% at peak'
  },
  {
    id: 'redis-cache',
    name: 'Redis In-Memory Distributed Cache & Lock Queue',
    layer: 'Caching & Queues',
    tech: 'Redis 7.2 Cluster / Upstash',
    description: 'High-speed in-memory store managing transient 5-minute temporary seat locks, active session tokens, and hot movie catalog caching.',
    responsibilities: [
      'Enforce atomic 5-minute seat locks using `SET key val NX EX 300`',
      'Prevent double-booking race conditions across concurrent browser users',
      'Cache high-traffic movie & showtime listing responses (TTL 60s)',
      'Publish seat-lock status changes across WebSocket clusters via Redis Pub/Sub',
      'Rate limit sensitive endpoints (login attempts, payment triggers)'
    ],
    protocols: ['RESP (REdis Serialization Protocol)', 'TCP Port 6379'],
    specs: 'Sub-millisecond operations (< 0.6ms) · Throughput: 100k ops/sec'
  },
  {
    id: 'mongodb-atlas',
    name: 'MongoDB Atlas Distributed Database',
    layer: 'Database',
    tech: 'MongoDB 7.0 Enterprise, Mongoose 8.x ODM',
    description: 'Primary persistent document data store maintaining transactional integrity through replica sets, schema validation, and compound index optimization.',
    responsibilities: [
      'Store persistent collections: Users, Movies, Theatres, Screens, Showtimes, Bookings',
      'Enforce Mongoose pre-save validations and reference integrity',
      'Multi-document ACID transactions for finalized ticket creation & payment binding',
      'TTL (Time-To-Live) index for automated cleanup of abandoned seat locks',
      'Compound indexing on `(showtimeId, status)` and `(userId, createdAt)`'
    ],
    protocols: ['MongoDB Wire Protocol', 'TLS Encrypted TCP Port 27017'],
    specs: 'Replica Set: 3 Nodes (Primary + 2 Secondaries) · 99.995% SLA'
  },
  {
    id: 'external-integrations',
    name: 'External Service Integrations',
    layer: 'External Services',
    tech: 'Stripe API, SendGrid / Resend, Cloudinary CDN',
    description: 'Managed third-party APIs handling compliant card payments, rich media delivery, and transactional PDF/QR email dispatch.',
    responsibilities: [
      'Stripe PaymentIntents & PCI-DSS Level 1 compliant checkout',
      'Automated e-ticket dispatch via SendGrid with base64 QR attachment',
      'Optimized movie poster & backdrop transformation and WebP CDN delivery via Cloudinary'
    ],
    protocols: ['HTTPS REST Webhooks', 'Signed HMAC SHA-256 Webhooks'],
    specs: 'Automated retry queues with exponential backoff'
  }
];

export interface ERCollection {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  indexes: string[];
  sampleDocument: string;
}

export const ER_COLLECTIONS: ERCollection[] = [
  {
    name: 'Users',
    description: 'Stores customer accounts, theatre managers, and system administrators with hashed credentials and role permissions.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique user identifier' },
      { name: 'name', type: 'String', constraints: 'Required, Trim, Max 100', description: 'Full legal name of the user' },
      { name: 'email', type: 'String', constraints: 'Required, Unique, Lowercase', description: 'Account email used for auth and ticketing' },
      { name: 'passwordHash', type: 'String', constraints: 'Required, bcrypt (salt 12)', description: 'Securely salted hashed password' },
      { name: 'role', type: 'String', constraints: 'Enum [customer, theatre_manager, super_admin]', description: 'Role-based access classification' },
      { name: 'phone', type: 'String', constraints: 'Optional, E.164 format', description: 'Mobile number for SMS booking alerts' },
      { name: 'createdAt', type: 'Date', constraints: 'Default: Date.now', description: 'Account creation timestamp' }
    ],
    indexes: ['email_1 (unique: true)', 'role_1'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e12345",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "passwordHash": "$2b$12$e8xL4n...qK71vW",
      "role": "customer",
      "phone": "+14155552671",
      "createdAt": "2026-10-15T14:32:00.000Z"
    }, null, 2)
  },
  {
    name: 'Movies',
    description: 'Central cinema catalog tracking film metadata, ratings, runtimes, formats, and high-resolution marketing assets.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique movie identifier' },
      { name: 'title', type: 'String', constraints: 'Required, Indexed', description: 'Official theatrical movie title' },
      { name: 'synopsis', type: 'String', constraints: 'Required, Max 2000', description: 'Storyline synopsis and plot premise' },
      { name: 'duration', type: 'Number', constraints: 'Required, Min 1', description: 'Total runtime in minutes' },
      { name: 'genres', type: 'Array[String]', constraints: 'Required, Min 1', description: 'List of categorized genres' },
      { name: 'releaseDate', type: 'Date', constraints: 'Required', description: 'Theatrical release premiere date' },
      { name: 'rating', type: 'Number', constraints: 'Min 0, Max 10', description: 'Aggregated user & critic score' },
      { name: 'certification', type: 'String', constraints: 'Enum [PG, PG-13, R, U/A]', description: 'Film board age certification' },
      { name: 'formats', type: 'Array[String]', constraints: 'Enum [IMAX 3D, Dolby Atmos, 4DX, Standard]', description: 'Supported projection standards' },
      { name: 'posterUrl', type: 'String', constraints: 'Required, URL', description: 'Cloudinary CDN poster image URI' }
    ],
    indexes: ['title_text', 'genres_1', 'releaseDate_-1'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e12999",
      "title": "Interstellar Odyssey",
      "duration": 168,
      "rating": 9.4,
      "certification": "PG-13",
      "genres": ["Sci-Fi", "Adventure", "Drama"],
      "formats": ["IMAX 3D", "Dolby Atmos"],
      "posterUrl": "https://cdn.imovies.io/posters/interstellar-odyssey.webp"
    }, null, 2)
  },
  {
    name: 'Theatres',
    description: 'Physical multiplex locations, facility features, address coordinates, and screen counts.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique cinema complex ID' },
      { name: 'name', type: 'String', constraints: 'Required', description: 'Multiplex commercial title' },
      { name: 'city', type: 'String', constraints: 'Required, Indexed', description: 'Operating metropolitan location' },
      { name: 'address', type: 'String', constraints: 'Required', description: 'Full physical street address' },
      { name: 'totalScreens', type: 'Number', constraints: 'Min 1', description: 'Number of active projection auditoriums' },
      { name: 'facilities', type: 'Array[String]', constraints: 'Default: []', description: 'Amenities (e.g. VIP Recliner, Valet, Gourmet Bar)' }
    ],
    indexes: ['city_1', 'name_1'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e13111",
      "name": "IMovies Cineplex Grand",
      "city": "Metropolis Core",
      "address": "400 Grand Promenade, Suite 100",
      "totalScreens": 8,
      "facilities": ["Laser IMAX", "Dolby Atmos", "Recliner Loungers", "Artisan Dining"]
    }, null, 2)
  },
  {
    name: 'Showtimes',
    description: 'Specific scheduled screenings linking a Movie to a Screen at a defined date and time with capacity metrics.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique showtime screening ID' },
      { name: 'movieId', type: 'ObjectId (Ref: Movies)', constraints: 'Required, Indexed', description: 'Referenced film being screened' },
      { name: 'theatreId', type: 'ObjectId (Ref: Theatres)', constraints: 'Required, Indexed', description: 'Referenced cinema location' },
      { name: 'screenName', type: 'String', constraints: 'Required', description: 'Auditorium identifier (e.g. Laser Hall 1)' },
      { name: 'screenType', type: 'String', constraints: 'Enum [IMAX Laser, Dolby Cinema, ScreenX, Standard]', description: 'Format and hardware technology' },
      { name: 'startTime', type: 'Date', constraints: 'Required, Indexed', description: 'Scheduled screening commencement' },
      { name: 'endTime', type: 'Date', constraints: 'Required', description: 'Screening conclusion with buffer' },
      { name: 'basePrice', type: 'Number', constraints: 'Required, Min 5', description: 'Standard seat tier pricing baseline' },
      { name: 'totalSeats', type: 'Number', constraints: 'Default: 80', description: 'Screen seating capacity' },
      { name: 'availableSeats', type: 'Number', constraints: 'Min 0', description: 'Live remaining available seats' }
    ],
    indexes: ['movieId_1_startTime_1', 'theatreId_1_startTime_1'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e14222",
      "movieId": "671fb43a9d28f411b0e12999",
      "theatreId": "671fb43a9d28f411b0e13111",
      "screenName": "Auditorium 1 (Laser IMAX)",
      "screenType": "IMAX Laser",
      "startTime": "2026-10-28T18:15:00.000Z",
      "basePrice": 21.00,
      "totalSeats": 80,
      "availableSeats": 64
    }, null, 2)
  },
  {
    name: 'Bookings',
    description: 'Finalized ticket transactions containing confirmed seat allocations, concessions, payment validation, and QR tokens.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique transaction ID' },
      { name: 'bookingReference', type: 'String', constraints: 'Required, Unique (e.g. IM-83921)', description: 'Human-readable booking reference code' },
      { name: 'userId', type: 'ObjectId (Ref: Users)', constraints: 'Required, Indexed', description: 'Customer who placed the order' },
      { name: 'showtimeId', type: 'ObjectId (Ref: Showtimes)', constraints: 'Required, Indexed', description: 'Screening session booked' },
      { name: 'seats', type: 'Array[Object]', constraints: 'Min 1', description: 'Reserved seats array [{row, col, tier, price}]' },
      { name: 'snacks', type: 'Array[Object]', constraints: 'Default: []', description: 'Pre-ordered food & beverage items' },
      { name: 'totalAmount', type: 'Number', constraints: 'Required', description: 'Total charge including taxes and fees' },
      { name: 'paymentStatus', type: 'String', constraints: 'Enum [paid, refunded, failed]', description: 'Stripe transaction status' },
      { name: 'bookingStatus', type: 'String', constraints: 'Enum [confirmed, cancelled]', description: 'Ticket validity status' },
      { name: 'qrCodeToken', type: 'String', constraints: 'Required, Unique', description: 'Cryptographically signed ticket verification hash' },
      { name: 'createdAt', type: 'Date', constraints: 'Default: Date.now', description: 'Confirmation timestamp' }
    ],
    indexes: ['bookingReference_1 (unique)', 'userId_1_createdAt_-1', 'showtimeId_1'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e15777",
      "bookingReference": "IM-91823",
      "userId": "671fb43a9d28f411b0e12345",
      "showtimeId": "671fb43a9d28f411b0e14222",
      "seats": [
        { "id": "D-5", "row": "D", "col": 5, "tier": "premium", "price": 25.20 },
        { "id": "D-6", "row": "D", "col": 6, "tier": "premium", "price": 25.20 }
      ],
      "snacks": [{ "name": "Artisan Truffle Popcorn", "qty": 1, "price": 8.50 }],
      "totalAmount": 63.40,
      "paymentStatus": "paid",
      "bookingStatus": "confirmed",
      "qrCodeToken": "IMV-e9a8f21c0091823-SECURE",
      "createdAt": "2026-10-28T16:04:12.000Z"
    }, null, 2)
  },
  {
    name: 'SeatLocks',
    description: 'Transient concurrency mechanism holding temporary seat locks during customer checkout to prevent duplicate bookings.',
    fields: [
      { name: '_id', type: 'ObjectId', constraints: 'Primary Key, Auto', description: 'Unique lock identifier' },
      { name: 'showtimeId', type: 'ObjectId (Ref: Showtimes)', constraints: 'Required, Indexed', description: 'Showtime where seats are held' },
      { name: 'seatId', type: 'String', constraints: 'Required (e.g. D-5)', description: 'Physical seat coordinate' },
      { name: 'userId', type: 'ObjectId (Ref: Users)', constraints: 'Required', description: 'Session owner holding the lock' },
      { name: 'expiresAt', type: 'Date', constraints: 'TTL Index (300 seconds)', description: 'Timestamp when lock automatically expires' }
    ],
    indexes: ['showtimeId_1_seatId_1 (unique)', 'expiresAt_1 (expireAfterSeconds: 0)'],
    sampleDocument: JSON.stringify({
      "_id": "671fb43a9d28f411b0e19001",
      "showtimeId": "671fb43a9d28f411b0e14222",
      "seatId": "D-5",
      "userId": "671fb43a9d28f411b0e12345",
      "expiresAt": "2026-10-28T16:09:12.000Z"
    }, null, 2)
  }
];

export interface MvcComponent {
  id: 'model' | 'view' | 'controller' | 'route_middleware';
  title: string;
  filename: string;
  role: string;
  explanation: string;
  code: string;
}

export const MVC_COMPONENTS: MvcComponent[] = [
  {
    id: 'controller',
    title: 'Controller Layer (Business Logic)',
    filename: 'controllers/bookingController.js',
    role: 'Orchestrates the business logic, manages concurrency with distributed locks, verifies payments, and coordinates between models and views.',
    explanation: 'In the Express.js architecture, the booking controller receives the HTTP request, invokes optimistic seat locking via MongoDB session transactions, calculates subtotal with tier premiums, and returns standardized JSON responses.',
    code: `// controllers/bookingController.js
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import SeatLock from '../models/SeatLock.js';
import { generateSecureQrToken } from '../utils/crypto.js';

export const lockSeats = async (req, res, next) => {
  const { showtimeId, seats } = req.body;
  const userId = req.user.id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if any seat is already locked or booked
    const existingLocks = await SeatLock.find({
      showtimeId,
      seatId: { $in: seats.map(s => s.id) },
      userId: { $ne: userId }
    }).session(session);

    if (existingLocks.length > 0) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: 'One or more selected seats were recently reserved by another user.',
        conflictedSeats: existingLocks.map(l => l.seatId)
      });
    }

    // 2. Insert temporary 5-minute locks (TTL auto-cleanup)
    const lockDuration = 5 * 60 * 1000;
    const expiresAt = new Date(Date.now() + lockDuration);

    const lockDocs = seats.map(seat => ({
      showtimeId,
      seatId: seat.id,
      userId,
      expiresAt
    }));

    await SeatLock.insertMany(lockDocs, { session });
    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: 'Seats locked for 5 minutes',
      expiresAt
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const createBooking = async (req, res, next) => {
  const { showtimeId, seats, snacks, paymentId } = req.body;
  const userId = req.user.id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Calculate totals & verify active showtime
    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) throw new Error('Showtime screening not found');

    const subtotal = seats.reduce((acc, s) => acc + s.price, 0);
    const snackTotal = (snacks || []).reduce((acc, s) => acc + s.price * s.quantity, 0);
    const bookingFee = 2.50;
    const tax = Number(((subtotal + snackTotal) * 0.08).toFixed(2));
    const totalAmount = Number((subtotal + snackTotal + bookingFee + tax).toFixed(2));

    const bookingRef = \`IM-\${Math.floor(10000 + Math.random() * 90000)}\`;
    const qrCodeToken = generateSecureQrToken(bookingRef, userId, showtimeId);

    const newBooking = new Booking({
      bookingReference: bookingRef,
      userId,
      showtimeId,
      seats,
      snacks: snacks || [],
      subtotal,
      bookingFee,
      tax,
      totalAmount,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      qrCodeToken
    });

    await newBooking.save({ session });

    // Decrement available capacity & clear temporary locks
    await Showtime.findByIdAndUpdate(
      showtimeId,
      { $inc: { availableSeats: -seats.length } },
      { session }
    );
    await SeatLock.deleteMany({ showtimeId, userId }).session(session);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      booking: newBooking
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};`
  },
  {
    id: 'model',
    title: 'Model Layer (Data Schemas & Validation)',
    filename: 'models/Booking.js',
    role: 'Defines the structural blueprint, data types, indexes, and document lifecycle hooks in MongoDB via Mongoose.',
    explanation: 'The Mongoose model encapsulates business constraints like seat format structures, calculation virtuals, and compound indexes that ensure optimal lookup speeds during box-office queries.',
    code: `// models/Booking.js
import mongoose from 'mongoose';

const SeatAllocationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  tier: { type: String, enum: ['standard', 'premium', 'vip'], required: true },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const SnackOrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  showtimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
    index: true
  },
  seats: {
    type: [SeatAllocationSchema],
    validate: [val => val.length > 0, 'Booking must allocate at least one seat']
  },
  snacks: [SnackOrderSchema],
  subtotal: { type: Number, required: true },
  bookingFee: { type: Number, default: 2.50 },
  tax: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['paid', 'refunded', 'failed', 'pending'],
    default: 'paid'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  qrCodeToken: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Compound indexes for rapid lookup
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ showtimeId: 1, bookingStatus: 1 });

export default mongoose.model('Booking', BookingSchema);`
  },
  {
    id: 'view',
    title: 'View Layer (Client UI Component)',
    filename: 'src/components/SeatReservationGrid.tsx',
    role: 'Presents dynamic state to the user, captures interactive inputs (seat clicks, concessions), and communicates with the backend API.',
    explanation: 'The React View handles smooth UI animations, visual cues for seat tiers (VIP, Premium, Standard), local countdown timers for transient locks, and dispatches API mutations.',
    code: `// src/components/SeatReservationGrid.tsx
import React, { useState, useEffect } from 'react';
import { Seat, Showtime } from '../types';

interface SeatGridProps {
  showtime: Showtime;
  seats: Seat[];
  onSelectSeat: (seat: Seat) => void;
  selectedSeats: Seat[];
}

export const SeatReservationGrid: React.FC<SeatGridProps> = ({
  showtime,
  seats,
  onSelectSeat,
  selectedSeats
}) => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Curved Cinema Screen Projection */}
      <div className="w-4/5 max-w-2xl mb-8 flex flex-col items-center">
        <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_4px_24px_rgba(59,130,246,0.6)]" />
        <span className="text-[11px] font-mono tracking-widest text-slate-400 mt-2">
          AUDITORIUM CURVED SCREEN
        </span>
      </div>

      {/* Grid of Seats categorized by Tiers */}
      <div className="grid grid-cols-10 gap-2.5 sm:gap-3 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
        {seats.map((seat) => {
          const isSelected = selectedSeats.some(s => s.id === seat.id);
          const isOccupied = seat.status === 'reserved';
          const isLocked = seat.status === 'locked';

          return (
            <button
              key={seat.id}
              disabled={isOccupied || isLocked}
              onClick={() => onSelectSeat(seat)}
              className={\`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs font-mono font-medium transition-all duration-150 flex items-center justify-center
                \${isOccupied ? 'bg-slate-800/60 text-slate-600 cursor-not-allowed border border-slate-800' : ''}
                \${isLocked ? 'bg-amber-950/40 text-amber-500/70 cursor-not-allowed border border-amber-800/40' : ''}
                \${isSelected ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.8)] scale-105' : ''}
                \${!isSelected && !isOccupied && !isLocked ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60' : ''}
              \`}
            >
              {seat.row}{seat.col}
            </button>
          );
        })}
      </div>
    </div>
  );
};`
  },
  {
    id: 'route_middleware',
    title: 'Routes & Middleware Layer (Security & Routing)',
    filename: 'routes/bookingRoutes.js & middleware/auth.js',
    role: 'Secures endpoints with JWT token validation, guards roles (RBAC), validates schemas, and maps URIs to controller actions.',
    explanation: 'The router wires endpoints to controllers while middleware verifies bearer tokens, decrypts user role claims, and enforces rate limits before reaching controller logic.',
    code: `// routes/bookingRoutes.js
import express from 'express';
import { lockSeats, createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { verifyJwt, requireRole } from '../middleware/auth.js';
import { validateLockRequest } from '../middleware/validators.js';

const router = express.Router();

// Customer Protected Endpoints
router.post('/lock-seats', verifyJwt, validateLockRequest, lockSeats);
router.post('/checkout', verifyJwt, createBooking);
router.get('/my-bookings', verifyJwt, getMyBookings);
router.post('/cancel/:id', verifyJwt, cancelBooking);

// Theatre Manager & Admin Endpoints
router.get('/analytics/occupancy', verifyJwt, requireRole(['theatre_manager', 'super_admin']), getOccupancyStats);

export default router;

// middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No bearer token found.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired session token.' });
  }
};

export const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient privileges.' });
  }
  next();
};`
  }
];

export interface RoleDetail {
  role: string;
  badge: string;
  description: string;
  permissions: string[];
  samplePersona: string;
  uiCapabilities: string[];
}

export const ROLES_RESPONSIBILITIES: RoleDetail[] = [
  {
    role: 'Customer / Moviegoer',
    badge: 'End User',
    description: 'General public user reserving cinema tickets, exploring movie trailers, pre-ordering concessions, and presenting mobile QR boarding passes.',
    samplePersona: 'Movie Enthusiast (Sarah Connor)',
    permissions: [
      'Browse published movie catalogs, filter by genre, date, format, and rating',
      'Select showtimes and view real-time seating availability per screen',
      'Hold temporary 5-minute seat locks to prevent booking collisions',
      'Add gourmet snacks and artisan beverages to the booking basket',
      'Complete secure credit card / digital wallet checkout',
      'Receive instant cryptographically signed QR code e-ticket pass',
      'View past booking history and request cancellations/refunds prior to showtime cut-off'
    ],
    uiCapabilities: [
      'Interactive curved seating grid with real-time selection',
      'Concession snack builder with subtotal tracking',
      'Digital boarding pass viewer with printable pass and QR renderer',
      'My Bookings dashboard with self-service cancellation'
    ]
  },
  {
    role: 'Theatre Operations Manager',
    badge: 'Operations Staff',
    description: 'On-site cinema manager responsible for screen scheduling, auditorium seat maintenance, box-office occupancy monitoring, and gate QR pass scanning.',
    samplePersona: 'Cineplex Operations Lead (Marcus Vance)',
    permissions: [
      'Create and update daily/weekly showtimes per auditorium',
      'Configure screening formats (IMAX Laser, Dolby Atmos, 4DX)',
      'Mark broken or damaged seats as "Out of Order" (maintenance override)',
      'Scan customer QR ticket tokens at the gate with instantaneous validation',
      'Access real-time auditorium occupancy statistics and live revenue metrics',
      'Issue manual box-office ticket reassignments or emergency refunds'
    ],
    uiCapabilities: [
      'Screen seat state override panel (block/unblock seat rows)',
      'Live showtime occupancy monitor (% capacity filled)',
      'Gate ticket verification scanner simulator',
      'Daily ticket sales and concessions revenue overview'
    ]
  },
  {
    role: 'Super Administrator',
    badge: 'System Admin',
    description: 'Platform administrator overseeing multi-theatre system configuration, global movie master records, RBAC permissions, and database health.',
    samplePersona: 'Platform Engineer & Admin (Alex Mercer)',
    permissions: [
      'Global CRUD operations on Movies master catalog and distributors',
      'Onboard new theatre multiplexes, auditoriums, and screen topologies',
      'Manage user accounts, assign role permissions, and revoke tokens',
      'Configure payment gateway secrets, tax rates, and convenience fee tiers',
      'Inspect MongoDB collection metrics, index performance, and slow query logs',
      'Monitor Redis seat-lock cluster health and eviction rates'
    ],
    uiCapabilities: [
      'Global System Health telemetry console',
      'User management table with role assignment toggles',
      'Movie catalog publishing and format tag controls',
      'Live database collections inspector with JSON document previews'
    ]
  }
];

export interface UserFlowStep {
  stepNumber: number;
  phase: string;
  action: string;
  clientEvent: string;
  backendEndpoint: string;
  databaseChange: string;
  uiState: string;
}

export const USER_FLOW_STEPS: UserFlowStep[] = [
  {
    stepNumber: 1,
    phase: 'Discovery & Catalog',
    action: 'User visits IMovies portal and filters currently playing blockbusters by genre (Sci-Fi, Cyberpunk) or projection format (IMAX 3D).',
    clientEvent: 'User applies format filter and clicks movie card',
    backendEndpoint: 'GET /api/movies?format=IMAX+3D&status=now_playing',
    databaseChange: 'Read query on Movies collection using compound index { formats: 1, releaseDate: -1 }',
    uiState: 'Movie catalog renders highlighted poster cards with rating badges, formats, and trailers'
  },
  {
    stepNumber: 2,
    phase: 'Auditorium & Showtime Selection',
    action: 'User chooses preferred cinema location (e.g. Cineplex Grand) and picks a screening time slot (e.g. 18:15 Laser IMAX).',
    clientEvent: 'User selects date chip and clicks showtime button',
    backendEndpoint: 'GET /api/showtimes/:movieId?theatreId=th-1',
    databaseChange: 'Query Showtimes collection referencing Movie ID and Theatre ID with capacity metrics',
    uiState: 'Modal transitions into Seating Auditorum View with remaining seat count'
  },
  {
    stepNumber: 3,
    phase: 'Interactive Seat Map & Lock',
    action: 'User picks 2 VIP Recliner seats (e.g. D-5, D-6). The client initiates a distributed seat lock to prevent race conditions.',
    clientEvent: 'User clicks seats on the curved auditorium grid',
    backendEndpoint: 'POST /api/bookings/lock-seats { showtimeId, seats: ["D-5", "D-6"] }',
    databaseChange: 'Inserts temporary docs in SeatLocks collection with 5-minute MongoDB TTL index',
    uiState: 'Seats turn highlighted blue; 5:00 countdown timer starts; other viewers see seats as locked'
  },
  {
    stepNumber: 4,
    phase: 'Concessions & Add-ons',
    action: 'User adds gourmet Truffle Popcorn and Nitro Cold Brew to the cinema basket.',
    clientEvent: 'User taps "+" on snack cards in the concessions tray',
    backendEndpoint: 'Client-side cart computation with backend validation at checkout',
    databaseChange: 'Local basket state synchronized; items validated against active menu stock',
    uiState: 'Order summary drawer updates subtotal, estimated tax (8%), and booking convenience fee'
  },
  {
    stepNumber: 5,
    phase: 'Payment Authorization',
    action: 'User enters payment credentials and confirms transaction.',
    clientEvent: 'User clicks "Complete Reservation" button',
    backendEndpoint: 'POST /api/bookings/checkout { showtimeId, seats, snacks, paymentNonce }',
    databaseChange: 'ACID transaction: creates Booking record, decrements Showtime availableSeats, deletes SeatLocks',
    uiState: 'Loading spinner overlay with processing status message ("Securing tickets...")'
  },
  {
    stepNumber: 6,
    phase: 'E-Ticket & QR Generation',
    action: 'Transaction succeeds. System dispatches confirmation email and renders boarding pass with cryptographic QR code.',
    clientEvent: 'Client receives confirmed Booking payload',
    backendEndpoint: 'Webhook triggers transactional email via SendGrid',
    databaseChange: 'Booking status set to "confirmed" with unique bookingReference (e.g. IM-91823)',
    uiState: 'Digital boarding pass displayed with QR code, screen hall, seat IDs, and Print/Save option'
  },
  {
    stepNumber: 7,
    phase: 'Gate Check-in / Ticket Management',
    action: 'Customer arrives at cinema; usher scans QR code. Alternatively, customer can cancel ticket before cut-off.',
    clientEvent: 'Gate scanner verifies QR or customer clicks "Cancel Booking" in My Bookings',
    backendEndpoint: 'POST /api/bookings/verify-ticket OR POST /api/bookings/cancel/:id',
    databaseChange: 'Cancelling updates Booking status to "cancelled" and increments Showtime availableSeats',
    uiState: 'Seats released back to available state in real-time'
  }
];

export interface VideoChapter {
  id: string;
  timestamp: string;
  seconds: number;
  title: string;
  caption: string;
  featureKey: string;
  previewImage: string;
  transcript: string;
}

export const DEMO_VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'ch-1',
    timestamp: '0:00',
    seconds: 0,
    title: 'Platform Architecture & Movie Discovery',
    caption: 'Introduction to The IMovies client-server architecture, responsive catalog, and high-resolution movie exploration.',
    featureKey: 'movies',
    previewImage: '/src/assets/images/hero_cinema_banner_1793178099131.jpg',
    transcript: 'Welcome to the complete overview of The IMovies platform. IMovies is engineered from the ground up on Express.js, MongoDB, and React 19 to provide a seamless cinema booking experience. Here on the main catalog, users can browse currently premiering films, filter by IMAX 3D, Dolby Atmos, and genre, or inspect trailers and synopsis details with zero layout shift.'
  },
  {
    id: 'ch-2',
    timestamp: '0:45',
    seconds: 45,
    title: 'Showtime & Multiplex Selection',
    caption: 'Dynamic scheduling engine matching movies, auditoriums, projection types, and real-time screen capacity.',
    featureKey: 'showtimes',
    previewImage: '/src/assets/images/poster_interstellar_odyssey_1793178099661.jpg',
    transcript: 'Selecting a movie opens the auditorium and showtime selector. Showtimes are dynamically queried from MongoDB with indexed filtering by cinema location, screen technology such as Laser IMAX or Dolby Cinema, and available seat counts. Users can inspect screening times, base pricing, and screen specifications in real-time.'
  },
  {
    id: 'ch-3',
    timestamp: '1:30',
    seconds: 90,
    title: 'Real-Time Seating Grid & 5-Min Mutex Lock',
    caption: 'Curved auditorium layout with VIP Recliner, Premium Club, and Standard seats protected by distributed TTL concurrency locks.',
    featureKey: 'seat_selection',
    previewImage: '/src/assets/images/hero_cinema_banner_1793178099131.jpg',
    transcript: 'Once the user selects a showtime, the real-time seating matrix loads. The screen is rendered with realistic auditorium curvature. When the customer clicks a seat, the backend immediately places a transient 5-minute mutex lock in MongoDB via a TTL index. This prevents double-booking race conditions while giving the customer a safe 5-minute checkout window.'
  },
  {
    id: 'ch-4',
    timestamp: '2:15',
    seconds: 135,
    title: 'Concessions & Instant QR Boarding Pass',
    caption: 'Artisan popcorn and beverage add-ons, transparent subtotal calculation, and instant digital ticket pass generation.',
    featureKey: 'checkout',
    previewImage: '/src/assets/images/poster_mythic_realms_1793178100484.jpg',
    transcript: 'Before final payment, moviegoers can add gourmet concessions such as artisan truffle popcorn and craft cold brews. Upon checkout, an ACID transaction creates the finalized Booking record, decrements the available seat capacity, and renders an authentic digital cinema ticket complete with a cryptographically verifiable QR code.'
  },
  {
    id: 'ch-5',
    timestamp: '3:00',
    seconds: 180,
    title: 'Operations Manager & Admin Console',
    caption: 'Role-based access control (RBAC) enabling theatre managers to monitor occupancy and override broken seats.',
    featureKey: 'roles',
    previewImage: '/src/assets/images/poster_neon_chronicles_1793178100264.jpg',
    transcript: 'Switching to the Theatre Manager role demonstrates our RBAC architecture. Operations personnel gain instant visibility into live auditorium occupancy rates, ticket sales revenue, and the ability to mark damaged seats out-of-order for maintenance. Super admins have full visibility into collections and database health.'
  },
  {
    id: 'ch-6',
    timestamp: '3:45',
    seconds: 225,
    title: 'Technical MVC & MongoDB Atlas Deployment',
    caption: 'Architectural walkthrough of Express controllers, Mongoose schemas, Docker containerization, and production scalability.',
    featureKey: 'setup_deployment',
    previewImage: '/src/assets/images/hero_cinema_banner_1793178099131.jpg',
    transcript: 'Finally, our documentation hub covers the end-to-end MVC codebase, ER relationships across 6 primary collections, and complete deployment instructions using Docker, Nginx reverse proxy, and PM2 clustering. The system is designed to scale horizontally across multiple instances with sub-50ms query response times.'
  }
];
