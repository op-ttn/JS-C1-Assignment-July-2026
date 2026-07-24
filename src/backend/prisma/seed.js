import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USERS = [
  {
    email: 'alice.agent@example.com',
    name: 'Alice Agent',
    role: 'AGENT',
  },
  {
    email: 'bob.agent@example.com',
    name: 'Bob Agent',
    role: 'AGENT',
  },
  {
    email: 'carol.admin@example.com',
    name: 'Carol Admin',
    role: 'ADMIN',
  },
  {
    email: 'dave.agent@example.com',
    name: 'Dave Agent',
    role: 'AGENT',
  },
];

const SAMPLE_TICKETS = [
  {
    title: 'Cannot reset password',
    description:
      'User reports the password reset email never arrives. Checked spam folder already.',
    priority: 'HIGH',
    status: 'OPEN',
    creatorEmail: 'alice.agent@example.com',
    assigneeEmail: 'bob.agent@example.com',
    comments: [
      {
        authorEmail: 'alice.agent@example.com',
        message: 'Customer called in; confirmed email address is correct.',
      },
    ],
  },
  {
    title: 'Dashboard charts load slowly',
    description:
      'Analytics dashboard takes 10+ seconds to render charts on first load.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    creatorEmail: 'bob.agent@example.com',
    assigneeEmail: 'carol.admin@example.com',
    comments: [
      {
        authorEmail: 'carol.admin@example.com',
        message: 'Profiling query times; looking at N+1 on ticket aggregates.',
      },
    ],
  },
  {
    title: 'Typo on login page subtitle',
    description: 'Login page subtitle has a misspelled product name.',
    priority: 'LOW',
    status: 'RESOLVED',
    creatorEmail: 'dave.agent@example.com',
    assigneeEmail: null,
    comments: [],
  },
];

async function upsertUsers() {
  const byEmail = new Map();

  for (const user of USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
      },
      create: user,
    });
    byEmail.set(user.email, record);
  }

  return byEmail;
}

async function seedTickets(usersByEmail) {
  for (const sample of SAMPLE_TICKETS) {
    const existing = await prisma.ticket.findFirst({
      where: { title: sample.title },
    });

    if (existing) {
      console.log(`Skipping existing ticket: "${sample.title}"`);
      continue;
    }

    const creator = usersByEmail.get(sample.creatorEmail);
    const assignee = sample.assigneeEmail
      ? usersByEmail.get(sample.assigneeEmail)
      : null;

    if (!creator) {
      throw new Error(`Missing seed user: ${sample.creatorEmail}`);
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: sample.title,
        description: sample.description,
        priority: sample.priority,
        status: sample.status,
        createdBy: creator.id,
        assignedTo: assignee?.id ?? null,
        comments: {
          create: sample.comments.map((comment) => {
            const author = usersByEmail.get(comment.authorEmail);
            if (!author) {
              throw new Error(`Missing seed user: ${comment.authorEmail}`);
            }
            return {
              message: comment.message,
              createdBy: author.id,
            };
          }),
        },
      },
    });

    console.log(`Created ticket: "${ticket.title}" (${ticket.status})`);
  }
}

async function main() {
  console.log('Seeding database…');
  const usersByEmail = await upsertUsers();
  console.log(`Upserted ${usersByEmail.size} users`);
  await seedTickets(usersByEmail);
  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
