// Shared content used by sections, the hero terminal and the command palette.
import { scrollToElement } from '../motion/smoothScroll';

// `level` is shown on the card in plain words; `proficiency` drives the
// kubectl-style status (Running / ContainerCreating) in the index.
export const skills = [
  { pod: 'aws-cloud', level: 'Used at work', summary: 'At Brandskey I hosted every client site on AWS, and I use it for containers, serverless functions and load-balanced apps in my own projects.', evidence: ['Brandskey client sites', 'FargateFlow', 'EC2 Auto Scaling', 'Text-to-Speech API'], domain: 'Cloud (AWS)', proficiency: 'Proficient', items: ['EC2', 'S3', 'VPC', 'IAM', 'Route 53', 'CloudFront', 'ALB', 'Auto Scaling', 'Lambda', 'API Gateway', 'ECS', 'Fargate', 'ECR', 'CloudWatch', 'CloudTrail', 'DynamoDB', 'Oracle Cloud (OCI)'] },
  { pod: 'cicd', level: 'Used at work', summary: 'Pipelines that test, build and ship on every push, so nobody has to deploy by hand or remember the steps.', evidence: ['Brandskey: 20 → 3 min deploys', 'DockerDeploy', 'Jenkins server'], domain: 'CI/CD', proficiency: 'Proficient', items: ['GitHub Actions', 'Jenkins', 'Pipeline-as-code', 'Automated test gates', 'Rolling deployments', 'Rollback strategy'] },
  { pod: 'iac-terraform', level: 'Used in projects', summary: 'I write infrastructure in Terraform, so it gets reviewed like any other code and can be rebuilt in minutes.', evidence: ['Terraform AWS Modules'], domain: 'Infrastructure as Code', proficiency: 'Proficient', items: ['Terraform', 'Reusable modules', 'S3 remote state', 'DynamoDB locking'] },
  { pod: 'containers', level: 'Used in projects', summary: 'Small Docker images that build the same way on every machine, deployed to ECS and Fargate.', evidence: ['FargateFlow', 'DockerDeploy: 60% smaller image'], domain: 'Containers', proficiency: 'Proficient', items: ['Docker', 'Multi-stage builds', 'Docker Compose', 'ECR', 'ECS', 'Fargate'] },
  { pod: 'linux-networking', level: 'Comfortable', summary: 'I am at home on a Linux server: services, logs, Nginx, DNS and certificates.', evidence: ['Jenkins server', 'Red Hat RH104'], domain: 'Linux & Networking', proficiency: 'Proficient', items: ['RHEL', 'systemd', 'SSH', 'Bash', 'Nginx reverse proxy', 'DNS', 'SSL/TLS', 'Load balancing', 'Subnetting', 'Log analysis'] },
  { pod: 'security', level: 'Used in projects', summary: 'I start from least privilege: tight IAM roles, private subnets and an audit trail for every change.', evidence: ['IAM Security Automation', 'FargateFlow'], domain: 'Security', proficiency: 'Proficient', items: ['IAM least privilege', 'RBAC', 'MFA', 'Security groups', 'Private subnets', 'CloudTrail audit logging'] },
  { pod: 'tools-languages', level: 'Used at work', summary: 'The everyday kit for writing code, reviewing it, testing APIs and keeping track of the work.', evidence: ['Brandskey: 5 React apps, 8 repos', 'Websenor QA'], domain: 'Tools & Languages', proficiency: 'Proficient', items: ['Git', 'GitHub', 'Python', 'JavaScript (ES6+)', 'React.js', 'HTML5', 'CSS3', 'REST APIs', 'Postman', 'JIRA'] },
  { pod: 'kubernetes', level: 'Learning', summary: 'What I am learning next, now that I have run containers on ECS and want to go further.', evidence: ['Working through the basics'], domain: 'Kubernetes', proficiency: 'Learning', items: ['Kubernetes basics'] },
];

export const projects = [
  {
    title: 'FargateFlow: Serverless Container Delivery Pipeline',
    description: 'Takes a commit all the way to production: it builds a container, pushes it to ECR and deploys it to ECS on Fargate, with no manual steps.',
    highlights: [
      'Nothing faces the internet directly: tasks run in private subnets with least-privilege IAM roles and tight security groups.',
      'Rolling updates swap tasks out gradually, so a deploy never drops live traffic.',
    ],
    tags: ['Fargate', 'ECS', 'ECR', 'IAM', 'VPC', 'Docker', 'GitHub Actions'],
  },
  {
    title: 'Terraform Reusable AWS Modules',
    description: 'Four reusable Terraform modules (EC2, VPC subnets, S3 and IAM), written so I stop building the same infrastructure by hand.',
    highlights: [
      'State lives in S3 with DynamoDB locking, so two people can never overwrite each other’s changes.',
      'The whole stack comes back from a single terraform apply in under 5 minutes.',
    ],
    tags: ['Terraform', 'EC2', 'VPC', 'S3', 'IAM', 'DynamoDB'],
  },
  {
    title: 'DockerDeploy: Multi-Stage CI/CD Pipeline',
    description: 'A five-step pipeline (install, lint, test, build, deploy) that runs on every push, so a release no longer depends on someone remembering the steps.',
    highlights: [
      'The production image is over 60% smaller: a two-stage Dockerfile ships only the built files on Nginx and leaves the Node.js tooling behind.',
      'Traced random build failures on 3 runners to mismatched Node.js versions, and pinned the version.',
    ],
    tags: ['Docker', 'GitHub Actions', 'Nginx', 'Node.js', 'React'],
  },
  {
    title: 'AWS IAM Security Automation',
    description: 'Setting up a new IAM user used to take six manual steps. Now one command creates the account, adds it to the right groups and enforces MFA.',
    highlights: [
      'Every account gets the same least-privilege policies.',
      'CloudTrail keeps a record of every permission change.',
    ],
    tags: ['IAM', 'CloudTrail', 'Bash', 'Python', 'RBAC'],
  },
  {
    title: 'EC2 Auto Scaling Web Application',
    description: 'A web app spread across 2 availability zones behind a load balancer, so losing one server does not take the site down.',
    highlights: [
      'CloudWatch CPU alarms add and remove servers as traffic changes.',
      'I tested it by terminating servers under load and watching them get replaced.',
    ],
    tags: ['EC2', 'ALB', 'Auto Scaling', 'VPC', 'CloudWatch'],
  },
  {
    title: 'Jenkins and Nginx CI/CD Server',
    description: 'Jenkins on Red Hat Linux, running as a systemd service behind Nginx with HTTPS, so it comes back on its own after a reboot.',
    highlights: [
      'Fixed 5 outages by reading the systemd journal and Nginx logs, then correcting the service and proxy config.',
    ],
    tags: ['Jenkins', 'Nginx', 'RHEL', 'systemd', 'SSL/TLS'],
  },
  {
    title: 'Serverless Text-to-Speech API',
    description: 'A small serverless API that turns text into speech with Amazon Polly and answers in under 300 ms.',
    highlights: [
      'The Lambda function can call Polly and write logs, and nothing else.',
    ],
    tags: ['Lambda', 'API Gateway', 'Amazon Polly', 'IAM'],
  },
];

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) scrollToElement(el);
};
