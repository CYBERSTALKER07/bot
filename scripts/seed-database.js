#!/usr/bin/env node

/**
 * Database Reset and Seed Script
 * 
 * This script will:
 * 1. Clear all existing data from the database
 * 2. Delete all test auth users
 * 3. Create test companies with logos
 * 4. Create test users (students and employers) with avatars
 * 5. Create job postings with images
 * 6. Create events with banners
 * 7. Create posts with images and mentions
 * 8. Create follows, likes, comments for recommendations
 * 9. Create notifications
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test data
const companies = [
    {
        name: 'TechCorp Solutions',
        industry: 'Technology',
        size: '1000-5000',
        location: 'Auckland, New Zealand',
        website: 'https://techcorp.example.com',
        logo_url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
        description: 'Leading technology solutions provider specializing in cloud computing and AI'
    },
    {
        name: 'DataVision Analytics',
        industry: 'Data Science',
        size: '100-500',
        location: 'Wellington, New Zealand',
        website: 'https://datavision.example.com',
        logo_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
        description: 'Data analytics and business intelligence consultancy'
    },
    {
        name: 'GreenEnergy NZ',
        industry: 'Renewable Energy',
        size: '500-1000',
        location: 'Christchurch, New Zealand',
        website: 'https://greenenergy.example.com',
        logo_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop',
        description: 'Sustainable energy solutions for a greener future'
    },
    {
        name: 'FinTech Innovations',
        industry: 'Financial Technology',
        size: '50-100',
        location: 'Auckland, New Zealand',
        website: 'https://fintech.example.com',
        logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop',
        description: 'Revolutionary financial technology and payment solutions'
    },
    {
        name: 'HealthTech Plus',
        industry: 'Healthcare Technology',
        size: '200-500',
        location: 'Hamilton, New Zealand',
        website: 'https://healthtech.example.com',
        logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
        description: 'Digital health solutions and medical software'
    }
];

const testUsers = [
    {
        email: 'student1@test.com',
        password: 'Test123!',
        full_name: 'Alex Johnson',
        role: 'student',
        avatar_url: 'https://i.pravatar.cc/150?img=1',
        bio: 'Computer Science student passionate about AI and ML',
        skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
        location: 'Auckland'
    },
    {
        email: 'student2@test.com',
        password: 'Test123!',
        full_name: 'Sarah Williams',
        role: 'student',
        avatar_url: 'https://i.pravatar.cc/150?img=2',
        bio: 'Data Science enthusiast with strong analytics background',
        skills: ['Python', 'R', 'SQL', 'Data Visualization'],
        location: 'Wellington'
    },
    {
        email: 'student3@test.com',
        password: 'Test123!',
        full_name: 'Michael Chen',
        role: 'student',
        avatar_url: 'https://i.pravatar.cc/150?img=3',
        bio: 'Full-stack developer interested in cloud technologies',
        skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
        location: 'Christchurch'
    },
    {
        email: 'employer1@test.com',
        password: 'Test123!',
        full_name: 'Emma Davis',
        role: 'employer',
        avatar_url: 'https://i.pravatar.cc/150?img=4',
        bio: 'HR Manager at TechCorp Solutions',
        location: 'Auckland',
        companyIndex: 0
    },
    {
        email: 'employer2@test.com',
        password: 'Test123!',
        full_name: 'James Wilson',
        role: 'employer',
        avatar_url: 'https://i.pravatar.cc/150?img=5',
        bio: 'Talent Acquisition Lead at DataVision',
        location: 'Wellington',
        companyIndex: 1
    }
];

async function deleteTestAuthUsers() {
    console.log('🗑️  Deleting test auth users...');

    for (const user of testUsers) {
        try {
            const { data: { users }, error } = await supabase.auth.admin.listUsers();
            if (error) {
                console.error('Error listing users:', error);
                continue;
            }

            const existingUser = users.find(u => u.email === user.email);
            if (existingUser) {
                const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
                if (deleteError) {
                    console.error(`Error deleting user ${user.email}:`, deleteError);
                } else {
                    console.log(`✅ Deleted auth user: ${user.email}`);
                }
            }
        } catch (error) {
            console.error(`Error processing user ${user.email}:`, error);
        }
    }
}

async function resetDatabase() {
    console.log('\n🗑️  Deleting all existing data...');

    // Delete in correct order to respect foreign keys
    const tables = [
        'notifications',
        'post_comments',
        'post_likes',
        'follows',
        'applications',
        'event_attendees',
        'posts',
        'jobs',
        'employer_events',
        'profiles',
        'companies'
    ];

    for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
            console.error(`Error deleting from ${table}:`, error);
        } else {
            console.log(`✅ Cleared ${table}`);
        }
    }
}

async function seedCompanies() {
    console.log('\n🏢 Creating companies...');

    const { data, error } = await supabase
        .from('companies')
        .insert(companies)
        .select();

    if (error) {
        console.error('Error creating companies:', error);
        return [];
    }

    console.log(`✅ Created ${data.length} companies`);
    return data;
}

async function seedUsers(companiesData) {
    console.log('\n👥 Creating test users...');

    const createdUsers = [];

    for (const user of testUsers) {
        let userId;

        // Try to create auth user, or get existing user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true
        });

        if (authError) {
            // Check for both message and code for "user already exists"
            const isEmailExists =
                authError.code === 'email_exists' ||
                authError.message?.includes('already registered') ||
                authError.message?.includes('Email address already registered');

            if (isEmailExists) {
                console.log(`ℹ️  User ${user.email} already exists, fetching details...`);
                // List users to find the existing one
                // Note: listing might be paginated, but for specific email search we don't have a direct method in admin api by email easily exposed here without listing
                // Actually, listUsers supports filtering by email? No, it lists all.
                // But we can try to signIn to get the ID? No, we need admin access.
                // Let's list users.
                const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

                if (!listError) {
                    const existingUser = users.find(u => u.email === user.email);
                    if (existingUser) {
                        userId = existingUser.id;
                        // Update password to ensure we know it
                        await supabase.auth.admin.updateUserById(userId, { password: user.password });
                    } else {
                        console.error(`Error: User ${user.email} reported as existing but not found in list.`);
                        continue;
                    }
                } else {
                    console.error(`Error listing users to find ${user.email}:`, listError);
                    continue;
                }
            } else {
                console.error(`Error creating user ${user.email}:`, authError);
                continue;
            }
        } else {
            userId = authData.user.id;
        }

        // Create user profile
        const profileData = {
            id: userId,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            bio: user.bio,
            role: user.role,
            skills: user.skills,
            location: user.location
        };

        // Add company_id for employers
        if (user.companyIndex !== undefined && companiesData[user.companyIndex]) {
            profileData.company_id = companiesData[user.companyIndex].id;
        }

        // Use upsert to handle existing profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert(profileData, { onConflict: 'id' });

        if (profileError) {
            console.error(`Error creating profile for ${user.email}:`, profileError);
        } else {
            console.log(`✅ Created/Updated user: ${user.full_name} (${user.email})`);
            createdUsers.push({ ...user, id: userId, company_id: profileData.company_id });
        }
    }

    return createdUsers;
}

async function seedJobs(users, companiesData) {
    console.log('\n💼 Creating job postings...');

    const employer1 = users.find(u => u.email === 'employer1@test.com');
    const employer2 = users.find(u => u.email === 'employer2@test.com');

    if (!employer1 || !employer2) {
        console.error('Employers not found, skipping job creation');
        return [];
    }

    const jobs = [
        {
            employer_id: employer1.id,
            company_id: employer1.company_id,
            company: companiesData[employer1.companyIndex].name,
            title: 'Senior Software Engineer',
            description: 'Join our team to build cutting-edge cloud solutions. Work with modern technologies and solve complex problems.',
            requirements: ['Bachelor\'s degree in CS', '5+ years experience'],
            location: 'Auckland, NZ',
            salary_range: '$120k-$150k',
            type: 'full-time',
            experience_level: 'senior',
            skills: ['Python', 'AWS', 'Docker', 'Kubernetes'],
            status: 'active'
        },
        {
            employer_id: employer2.id,
            company_id: employer2.company_id,
            company: companiesData[employer2.companyIndex].name,
            title: 'Data Analyst',
            description: 'Analyze complex datasets and provide actionable insights to drive business decisions.',
            requirements: ['Degree in Statistics or related field', '2+ years experience'],
            location: 'Wellington, NZ',
            salary_range: '$80k-$100k',
            type: 'full-time',
            experience_level: 'mid-level',
            skills: ['SQL', 'Python', 'Tableau', 'Excel'],
            status: 'active'
        }
    ];

    const { data, error } = await supabase
        .from('jobs')
        .insert(jobs)
        .select();

    if (error) {
        console.error('Error creating jobs:', error);
        return [];
    }

    console.log(`✅ Created ${data.length} job postings`);
    return data;
}

async function seedEvents(users, companiesData) {
    console.log('\n📅 Creating events...');

    const employer1 = users.find(u => u.email === 'employer1@test.com');
    const employer2 = users.find(u => u.email === 'employer2@test.com');

    if (!employer1 || !employer2) {
        console.error('Employers not found, skipping event creation');
        return [];
    }

    const events = [
        {
            employer_id: employer1.id,
            title: 'Tech Career Fair 2024',
            description: 'Meet leading tech companies and explore career opportunities',
            event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Auckland Convention Centre',
            event_type: 'recruiting',
            capacity: 500,
            banner_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop',
            status: 'upcoming'
        },
        {
            employer_id: employer2.id,
            title: 'Data Science Workshop',
            description: 'Hands-on workshop on machine learning and data analytics',
            event_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Wellington Tech Hub',
            event_type: 'workshop',
            capacity: 50,
            banner_image_url: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&h=400&fit=crop',
            status: 'upcoming'
        }
    ];

    const { data, error } = await supabase
        .from('employer_events')
        .insert(events)
        .select();

    if (error) {
        console.error('Error creating events:', error);
        return [];
    }

    console.log(`✅ Created ${data.length} events`);
    return data;
}

async function seedPosts(users) {
    console.log('\n📝 Creating posts...');

    const student1 = users.find(u => u.email === 'student1@test.com');
    const student2 = users.find(u => u.email === 'student2@test.com');
    const employer1 = users.find(u => u.email === 'employer1@test.com');

    if (!student1 || !student2 || !employer1) {
        console.error('Users not found, skipping post creation');
        return [];
    }

    const posts = [
        {
            user_id: student1.id,
            content: 'Just completed my Machine Learning certification! Excited to apply these skills in real-world projects. #MachineLearning #AI',
            image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
            likes_count: 15,
            comments_count: 3
        },
        {
            user_id: employer1.id,
            content: 'We\'re hiring! TechCorp is looking for talented developers to join our team. Check out our open positions! #Hiring #TechJobs',
            image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
            likes_count: 28,
            comments_count: 5
        },
        {
            user_id: student2.id,
            content: 'Amazing data visualization workshop today! Thanks @DataVision for the insights. #DataScience',
            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
            likes_count: 12,
            comments_count: 2
        }
    ];

    const { data, error } = await supabase
        .from('posts')
        .insert(posts)
        .select();

    if (error) {
        console.error('Error creating posts:', error);
        return [];
    }

    console.log(`✅ Created ${data.length} posts`);
    return data;
}

async function seedFollows(users) {
    console.log('\n👥 Creating follows...');

    const student1 = users.find(u => u.email === 'student1@test.com');
    const student2 = users.find(u => u.email === 'student2@test.com');
    const student3 = users.find(u => u.email === 'student3@test.com');
    const employer1 = users.find(u => u.email === 'employer1@test.com');

    if (!student1 || !student2 || !student3 || !employer1) {
        console.error('Users not found, skipping follows creation');
        return;
    }

    const follows = [
        { follower_id: student1.id, following_id: student2.id },
        { follower_id: student1.id, following_id: employer1.id },
        { follower_id: student2.id, following_id: student3.id },
        { follower_id: student3.id, following_id: student1.id }
    ];

    const { data, error } = await supabase
        .from('follows')
        .insert(follows)
        .select();

    if (error) {
        console.error('Error creating follows:', error);
        return;
    }

    console.log(`✅ Created ${data.length} follows`);
}

async function seedPostLikes(users, posts) {
    console.log('\n❤️  Creating post likes...');

    const student2 = users.find(u => u.email === 'student2@test.com');
    const student3 = users.find(u => u.email === 'student3@test.com');
    const student1 = users.find(u => u.email === 'student1@test.com');

    if (!student1 || !student2 || !student3 || posts.length < 2) {
        console.error('Users or posts not found, skipping likes creation');
        return;
    }

    const likes = [
        { post_id: posts[0].id, user_id: student2.id },
        { post_id: posts[0].id, user_id: student3.id },
        { post_id: posts[1].id, user_id: student1.id }
    ];

    const { data, error } = await supabase
        .from('post_likes')
        .insert(likes)
        .select();

    if (error) {
        console.error('Error creating post likes:', error);
        return;
    }

    console.log(`✅ Created ${data.length} post likes`);
}

async function seedPostComments(users, posts) {
    console.log('\n💬 Creating post comments...');

    const student2 = users.find(u => u.email === 'student2@test.com');
    const employer2 = users.find(u => u.email === 'employer2@test.com');

    if (!student2 || !employer2 || posts.length < 3) {
        console.error('Users or posts not found, skipping comments creation');
        return [];
    }

    const comments = [
        {
            post_id: posts[0].id,
            user_id: student2.id,
            content: 'Congratulations @Alex! Well deserved! 🎉'
        },
        {
            post_id: posts[2].id,
            user_id: employer2.id,
            content: 'Glad you enjoyed it @Sarah! Hope to see you at future events.'
        }
    ];

    const { data, error } = await supabase
        .from('post_comments')
        .insert(comments)
        .select();

    if (error) {
        console.error('Error creating post comments:', error);
        return [];
    }

    console.log(`✅ Created ${data.length} post comments`);
    return data;
}

async function seedNotifications(users, posts, comments) {
    console.log('\n🔔 Creating notifications...');

    const student1 = users.find(u => u.email === 'student1@test.com');
    const student2 = users.find(u => u.email === 'student2@test.com');
    const student3 = users.find(u => u.email === 'student3@test.com');

    if (!student1 || !student2 || !student3 || posts.length < 1 || comments.length < 1) {
        console.error('Users, posts, or comments not found, skipping notifications creation');
        return;
    }

    const notifications = [
        {
            user_id: student1.id,
            actor_id: student2.id,
            type: 'mention',
            title: 'You were mentioned',
            message: '@Sarah mentioned you in a comment',
            action_url: `/post/${comments[0].id}`,
            is_read: false
        },
        {
            user_id: student1.id,
            actor_id: student3.id,
            type: 'like',
            title: 'New like on your post',
            message: 'Your post received a new like',
            action_url: `/post/${posts[0].id}`,
            is_read: false
        },
        {
            user_id: student2.id,
            actor_id: student1.id,
            type: 'follow',
            title: 'New follower',
            message: 'Alex Johnson started following you',
            action_url: `/profile/${student1.id}`,
            is_read: false
        }
    ];

    const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

    if (error) {
        console.error('Error creating notifications:', error);
        return;
    }

    console.log(`✅ Created ${data.length} notifications`);
}

async function main() {
    console.log('🚀 Starting database reset and seed...\n');

    try {
        // Step 1: Delete test auth users
        await deleteTestAuthUsers();

        // Step 2: Reset database tables
        await resetDatabase();

        // Step 3: Seed companies
        const companiesData = await seedCompanies();

        // Step 4: Seed users
        const users = await seedUsers(companiesData);

        // Step 5: Seed jobs
        const jobs = await seedJobs(users, companiesData);

        // Step 6: Seed events
        const events = await seedEvents(users, companiesData);

        // Step 7: Seed posts
        const posts = await seedPosts(users);

        // Step 8: Seed follows
        await seedFollows(users);

        // Step 9: Seed post likes
        await seedPostLikes(users, posts);

        // Step 10: Seed post comments
        const comments = await seedPostComments(users, posts);

        // Step 11: Seed notifications
        await seedNotifications(users, posts, comments);

        console.log('\n✨ Database reset and seed complete!');
        console.log('\n📝 Test Credentials:');
        testUsers.forEach(user => {
            console.log(`   ${user.email} / ${user.password} (${user.role})`);
        });

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

main();
