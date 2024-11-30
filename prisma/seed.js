"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function main() {
    const isDev = process.env.NODE_ENV === 'development';
    const shouldSeed = process.env.SEED_DATABASE === 'true';
    if (!isDev && !shouldSeed) {
        console.log('Seeding is only allowed in development or with SEED_DATABASE flag');
        return;
    }
    try {
        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await prisma.teamMember.deleteMany();
        await prisma.project.deleteMany();
        console.log('✅ Successfully cleared existing data');
        // Create sample projects
        const projects = await Promise.all(Array.from({ length: 5 }, async () => {
            return prisma.project.create({
                data: {
                    name: faker_1.faker.company.name(),
                    description: faker_1.faker.company.catchPhrase(),
                    githubUrl: `https://github.com/${faker_1.faker.internet.userName()}/${faker_1.faker.internet.domainWord()}`,
                    tokenSymbol: faker_1.faker.finance.currencyCode(),
                    initialSupply: faker_1.faker.number.int({ min: 1000000, max: 1000000000 }),
                    decimals: 6,
                    vestingSchedule: {
                        cliff: "1 year",
                        vesting: "4 years",
                        initial: "10%"
                    },
                    initialLiquidity: faker_1.faker.number.int({ min: 100000, max: 1000000 }),
                    startingPrice: parseFloat(faker_1.faker.finance.amount({ min: 0.01, max: 1, dec: 6 })),
                    creatorId: faker_1.faker.string.uuid(),
                    team: {
                        create: Array.from({ length: faker_1.faker.number.int({ min: 2, max: 5 }) }, () => ({
                            name: faker_1.faker.person.fullName(),
                            role: faker_1.faker.person.jobTitle(),
                            linkedIn: `https://linkedin.com/in/${faker_1.faker.internet.userName()}`,
                            kycVerificationId: faker_1.faker.string.uuid()
                        }))
                    }
                }
            });
        }));
        console.log('✅ Created projects:', projects.length);
        console.log('✅ Seeding completed successfully');
    }
    catch (e) {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
