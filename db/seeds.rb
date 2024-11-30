# Clear existing data while maintaining referential integrity
puts "Clearing existing data..."
[Activity, Project, User].each(&:delete_all)

# Create realistic users
puts "Creating users..."
users = [
  { name: "Sarah Chen", email: "sarah.chen@techforge.com", role: "admin" },
  { name: "Michael Rodriguez", email: "m.rodriguez@innovatelab.co", role: "user" },
  { name: "Emma Thompson", email: "emma.t@cloudstack.io", role: "user" },
  { name: "James Wilson", email: "jwilson@devops.net", role: "user" },
  { name: "Aisha Patel", email: "aisha.patel@agiledev.com", role: "user" },
  # ... more users
].map { |attrs| User.create!(attrs) }

# Project categories and technologies for realistic variety
PROJECT_CATEGORIES = [
  "Web Application",
  "Mobile App",
  "Data Analytics",
  "Machine Learning",
  "DevOps",
  "Cloud Migration",
  "Security Implementation",
  "API Development",
  "Legacy System Modernization",
  "Digital Transformation"
]

TECHNOLOGIES = [
  "React", "Node.js", "Python", "AWS", "Docker",
  "Kubernetes", "TensorFlow", "PostgreSQL", "Ruby on Rails",
  "Vue.js", "Angular", "MongoDB", "GraphQL", "Terraform"
]

# Generate realistic project names and descriptions
def generate_project_name
  prefixes = ["Project", "Initiative", "Platform", "System", "Application"]
  suffixes = ["Modernization", "Implementation", "Migration", "Development", "Enhancement"]
  "#{TECHNOLOGIES.sample} #{prefixes.sample} #{suffixes.sample}"
end

def generate_description(name)
  "Implementing a #{name.downcase} to improve business efficiency and scalability. " \
  "Utilizing #{TECHNOLOGIES.sample(3).join(', ')} to ensure robust architecture and " \
  "maintainable codebase. Focus on security, performance, and user experience."
end

# Create projects with realistic data
puts "Creating projects..."
200.times do |i|
  name = generate_project_name
  project = Project.create!(
    name: name,
    description: generate_description(name),
    category: PROJECT_CATEGORIES.sample,
    status: ["planning", "in_progress", "completed", "on_hold"].sample,
    start_date: rand(1..365).days.ago,
    user: users.sample
  )
  
  # Create multiple activities for each project
  rand(5..15).times do
    activity_date = rand(project.start_date..Time.current)
    Activity.create!(
      project: project,
      user: users.sample,
      action: [
        "Updated project documentation",
        "Deployed new feature to staging",
        "Completed code review",
        "Fixed critical bug",
        "Implemented new API endpoint",
        "Optimized database queries",
        "Added automated tests",
        "Performed security audit",
        "Updated dependencies",
        "Refactored legacy code"
      ].sample,
      created_at: activity_date,
      updated_at: activity_date
    )
  end
end

puts "Seed data creation completed!"
puts "Created #{User.count} users"
puts "Created #{Project.count} projects"
puts "Created #{Activity.count} activities" 