import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@blogged.com' },
    update: {},
    create: {
      id: 'user-1',
      email: 'admin@blogged.com',
      name: 'Sarah Johnson',
      username: 'sarahjohnson',
      password: hashedPassword,
      bio: 'Nature enthusiast and environmental writer. Exploring the wonders of our planet through words and photography.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
  });

  console.log('Created user:', user);

  const posts = await Promise.all([
    prisma.post.upsert({
      where: { id: 'post-1' },
      update: {},
      create: {
        id: 'post-1',
        title: 'The Hidden Life of Ancient Forests: A Journey Through Time',
        content: `Deep within the heart of our planet's oldest forests lies a world that has remained largely unchanged for millennia. These ancient ecosystems, some dating back thousands of years, are not just collections of trees but living museums of Earth's evolutionary history.

Walking through an ancient forest is like stepping into a different dimension. The air is thick with the scent of moss and decaying wood, creating an atmosphere that feels both primordial and sacred. Towering giants, their trunks scarred by centuries of storms and fires, stand as silent witnesses to the passage of time.

These forests are home to some of the most complex ecosystems on Earth. From the microscopic fungi that form vast underground networks connecting trees, to the majestic birds of prey that nest in the highest branches, every element plays a crucial role in maintaining the delicate balance of life.

The biodiversity found in ancient forests is staggering. Scientists estimate that a single hectare of old-growth forest can contain more species than entire countries. This incredible variety isn't just beautiful—it's essential for the health of our planet. These forests act as carbon sinks, helping to regulate our climate, while their complex root systems prevent soil erosion and maintain water quality.

But ancient forests are under threat. Logging, climate change, and human development are putting these irreplaceable ecosystems at risk. Once destroyed, these forests cannot be replaced—they represent thousands of years of natural evolution that we simply cannot replicate.

Protecting these forests isn't just about preserving beautiful landscapes; it's about safeguarding the very systems that make life on Earth possible. As we learn more about the intricate relationships within these ecosystems, we're discovering that their value extends far beyond what we can see with our eyes.

The next time you find yourself in a forest, take a moment to consider the incredible journey that brought you there. You're standing in a living testament to the resilience and beauty of nature—a reminder that we are part of something much larger than ourselves.`,
        excerpt: 'Discover the secrets of Earth\'s oldest forests and the incredible ecosystems that have thrived for thousands of years.',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        published: true,
        authorId: user.id,
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-2' },
      update: {},
      create: {
        id: 'post-2',
        title: 'The Secret Language of Whales: Understanding Ocean Giants',
        content: `Beneath the surface of our oceans, in a world of darkness and pressure, exists one of the most sophisticated communication systems on Earth. Whales, these magnificent creatures that have roamed our seas for millions of years, possess an intelligence and social complexity that rivals our own.

The songs of humpback whales are among the most beautiful and mysterious sounds in nature. These complex vocalizations can travel for hundreds of miles through the ocean, carrying messages that we're only beginning to understand. Each population of whales has its own distinct dialect, passed down through generations like cultural traditions.

But whale communication goes far beyond simple songs. These animals use a combination of sounds, body language, and even touch to convey complex information. They can coordinate hunting strategies, share information about food sources, and maintain social bonds across vast distances.

Recent research has revealed that whales may even have names for each other. Scientists have discovered that individual whales have unique signature calls, similar to how humans have names. When a whale is separated from its family, it can call out using these signature sounds to locate its loved ones.

The social structures of whale communities are incredibly complex. Many species live in matriarchal societies, where older females lead their families and pass down crucial knowledge about migration routes, feeding grounds, and survival strategies. This cultural transmission is essential for the survival of whale populations.

However, human activities are threatening these incredible creatures. Noise pollution from ships and sonar can interfere with whale communication, while climate change is affecting their food sources and migration patterns. Plastic pollution and fishing nets pose direct threats to their survival.

Understanding and protecting whales isn't just about saving beautiful animals—it's about preserving the health of our oceans. As apex predators, whales play a crucial role in maintaining the balance of marine ecosystems. Their presence helps regulate the populations of other species and ensures the health of the entire ocean food web.

The more we learn about these magnificent creatures, the more we realize how much we have in common with them. Like us, they form strong family bonds, mourn their dead, and pass down cultural knowledge through generations. They remind us that intelligence and emotional complexity aren't unique to humans—they're gifts that have evolved multiple times in the natural world.

As we work to protect these ocean giants, we're not just saving whales—we're preserving a connection to the wild, untamed spirit of our planet. In their songs, we hear echoes of a world that existed long before humans, and we're reminded of our responsibility to protect the natural wonders that still remain.`,
        excerpt: 'Explore the fascinating world of whale communication and discover how these ocean giants share information across vast distances.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        published: true,
        authorId: user.id,
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-3' },
      update: {},
      create: {
        id: 'post-3',
        title: 'The Amazing World of Bioluminescence: Nature\'s Light Show',
        content: `In the darkest depths of our oceans and the quietest corners of our forests, nature puts on one of its most spectacular displays: bioluminescence. This incredible phenomenon, where living organisms produce their own light, is one of the most beautiful and mysterious adaptations in the natural world.

Bioluminescence has evolved independently at least 40 times in different species, making it one of the most successful adaptations in nature. From tiny bacteria to massive squid, organisms across the tree of life have found ways to harness the power of light for survival.

In the ocean, bioluminescence serves many purposes. For some creatures, like the anglerfish, it's a hunting tool—a glowing lure that attracts prey in the pitch-black depths. For others, like fireflies, it's a way to find mates in the darkness. Some species use bioluminescence to communicate, while others use it to startle predators or camouflage themselves against the light filtering down from above.

The chemistry behind bioluminescence is fascinating. Most bioluminescent organisms use a molecule called luciferin, which reacts with oxygen in the presence of an enzyme called luciferase to produce light. The color of the light depends on the specific type of luciferin and the environment in which the reaction occurs.

Some of the most spectacular displays of bioluminescence occur in our oceans. During certain times of the year, entire bays can glow with the light of millions of bioluminescent plankton. When disturbed by waves or swimming fish, these tiny organisms create trails of light that look like underwater fireworks.

On land, fireflies are perhaps the most famous bioluminescent creatures. Their synchronized flashing displays in summer evenings are one of nature's most enchanting sights. Each species has its own unique flashing pattern, allowing males and females to find each other in the darkness.

But bioluminescence isn't just beautiful—it's also incredibly useful to humans. Scientists have harnessed the genes responsible for bioluminescence to create tools for medical research, environmental monitoring, and even art. These glowing proteins help researchers track the spread of diseases, monitor pollution levels, and understand how cells work.

The study of bioluminescence has also led to important discoveries about evolution and adaptation. By understanding how different species have evolved similar abilities independently, scientists are learning more about the fundamental processes that drive evolution.

As we continue to explore the natural world, we're discovering new bioluminescent species and learning more about how this incredible adaptation works. Each discovery reminds us of the endless creativity of evolution and the beauty that can be found in even the darkest places.

Bioluminescence is a reminder that light can be found in the most unexpected places. In a world that often seems dark and uncertain, these natural light shows offer hope and wonder, reminding us of the incredible diversity and beauty of life on Earth.`,
        excerpt: 'Discover the fascinating world of bioluminescent organisms and learn how nature creates its own spectacular light shows.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
        published: true,
        authorId: user.id,
      },
    }),
  ]);

  console.log('Created posts:', posts);

  await prisma.comment.upsert({
    where: { id: 'comment-1' },
    update: {},
    create: {
      id: 'comment-1',
      content: 'This article perfectly captures the magic of ancient forests. I\'ve always felt there\'s something special about walking among trees that have witnessed centuries of history.',
      postId: 'post-1',
      authorId: user.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment-2' },
    update: {},
    create: {
      id: 'comment-2',
      content: 'The part about whale communication is fascinating! It\'s amazing how much we still have to learn about these incredible creatures.',
      postId: 'post-2',
      authorId: user.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment-3' },
    update: {},
    create: {
      id: 'comment-3',
      content: 'I\'ve seen bioluminescent plankton in person and it\'s absolutely magical. This article does a great job explaining the science behind the beauty.',
      postId: 'post-3',
      authorId: user.id,
    },
  });

  await prisma.like.upsert({
    where: { postId_userId: { postId: 'post-1', userId: user.id } },
    update: {},
    create: {
      postId: 'post-1',
      userId: user.id,
    },
  });

  await prisma.like.upsert({
    where: { postId_userId: { postId: 'post-2', userId: user.id } },
    update: {},
    create: {
      postId: 'post-2',
      userId: user.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
