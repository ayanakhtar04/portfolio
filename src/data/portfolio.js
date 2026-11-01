// Shared content used by sections, the hero terminal and the command palette.
import { scrollToElement } from '../motion/smoothScroll';

export const skills = [
  { pod: 'aws-cloud', summary: 'Hosting live client sites and running containers, functions and load-balanced apps on AWS.', evidence: ['Brandskey client sites', 'FargateFlow', 'EC2 Auto Scaling', 'Text-to-Speech API'], domain: 'Cloud (AWS)', proficiency: 'Proficient', items: ['EC2', 'S3', 'VPC', 'IAM', 'Route 53', 'CloudFront', 'ALB', 'Auto Scaling', 'Lambda', 'API Gateway', 'ECS', 'Fargate', 'ECR', 'CloudWatch', 'CloudTrail', 'DynamoDB', 'Oracle Cloud (OCI)'] },
  { pod: 'cicd', summary: 'Pipelines that test, build and ship on every push, with safe rollouts.', evidence: ['Brandskey: 20 → 3 min deploys', 'DockerDeploy', 'Jenkins server'], domain: 'CI/CD', proficiency: 'Proficient', items: ['GitHub Actions', 'Jenkins', 'Pipeline-as-code', 'Automated test gates', 'Rolling deployments', 'Rollback strategy'] },
  { pod: 'iac-terraform', summary: 'Infrastructure as version-controlled code, rebuildable in minutes.', evidence: ['Terraform AWS Modules'], domain: 'Infrastructure as Code', proficiency: 'Proficient', items: ['Terraform', 'Reusable modules', 'S3 remote state', 'DynamoDB locking'] },
  { pod: 'containers', summary: 'Small, reproducible images deployed to managed container platforms.', evidence: ['FargateFlow', 'DockerDeploy: 60% smaller image'], domain: 'Containers', proficiency: 'Proficient', items: ['Docker', 'Multi-stage builds', 'Docker Compose', 'ECR', 'ECS', 'Fargate'] },
  { pod: 'linux-networking', summary: 'Running and debugging services on Linux, from systemd to TLS.', evidence: ['Jenkins server', 'Red Hat RH104'], domain: 'Linux & Networking', proficiency: 'Proficient', items: ['RHEL', 'systemd', 'SSH', 'Bash', 'Nginx reverse proxy', 'DNS', 'SSL/TLS', 'Load balancing', 'Subnetting', 'Log analysis'] },
  { pod: 'security', summary: 'Least-privilege access, private networking and audit trails by default.', evidence: ['IAM Security Automation', 'FargateFlow'], domain: 'Security', proficiency: 'Proficient', items: ['IAM least privilege', 'RBAC', 'MFA', 'Security groups', 'Private subnets', 'CloudTrail audit logging'] },
  { pod: 'tools-languages', summary: 'The everyday toolkit for code, reviews, testing and tracking.', evidence: ['Brandskey: 5 React apps, 8 repos', 'Websenor QA'], domain: 'Tools & Languages', proficiency: 'Proficient', items: ['Git', 'GitHub', 'Python', 'JavaScript (ES6+)', 'React.js', 'HTML5', 'CSS3', 'REST APIs', 'Postman', 'JIRA'] },
  { pod: 'kubernetes', summary: 'Next on the list: orchestration beyond single services.', evidence: ['Learning the basics'], domain: 'Kubernetes', proficiency: 'Learning', items: ['Kubernetes basics'] },
];

export const projects = [
  {
    title: 'FargateFlow: Serverless Container Delivery Pipeline',
    description: 'Every commit builds a container, pushes the image to ECR and deploys it to ECS on Fargate with no manual steps.',
    highlights: [
      'Least-privilege IAM task and execution roles, private VPC subnets and tight security groups: nothing is exposed publicly.',
      'ECS task and service definitions replace tasks gradually, so deployments do not drop live traffic.',
    ],
    tags: ['Fargate', 'ECS', 'ECR', 'IAM', 'VPC', 'Docker', 'GitHub Actions'],
  },
  {
    title: 'Terraform Reusable AWS Modules',
    description: 'Four reusable modules for EC2, VPC subnets, S3 buckets and IAM roles that replace hand-built infrastructure with version-controlled code.',
    highlights: [
      'S3 remote state with DynamoDB locking, so several people can run changes without corrupting state.',
      'The whole stack rebuilds from a single terraform apply, with full recovery in under 5 minutes.',
    ],
    tags: ['Terraform', 'EC2', 'VPC', 'S3', 'IAM', 'DynamoDB'],
  },
  {
    title: 'DockerDeploy: Multi-Stage CI/CD Pipeline',
    description: 'A 5-stage pipeline (install, lint, test, build, deploy) that runs on every push and removes manual releases.',
    highlights: [
      'Production image over 60% smaller: a two-stage Dockerfile serves static files from Nginx and leaves Node.js build tools behind.',
      'Fixed flaky failures across 3 runners by pinning the Node.js version in the workflow.',
    ],
    tags: ['Docker', 'GitHub Actions', 'Nginx', 'Node.js', 'React'],
  },
  {
    title: 'AWS IAM Security Automation',
    description: 'A 6-step manual process turned into one repeatable command that creates IAM accounts, assigns groups and enforces MFA.',
    highlights: [
      'Same least-privilege policies applied to every account.',
      'CloudTrail logging keeps a record of every permission change.',
    ],
    tags: ['IAM', 'CloudTrail', 'Bash', 'Python', 'RBAC'],
  },
  {
    title: 'EC2 Auto Scaling Web Application',
    description: 'An app deployed across 2 availability zones behind an Application Load Balancer, so one failed instance does not take the site down.',
    highlights: [
      'CloudWatch CPU alarms drive Auto Scaling.',
      'Failover tested by terminating instances under load and confirming they were replaced.',
    ],
    tags: ['EC2', 'ALB', 'Auto Scaling', 'VPC', 'CloudWatch'],
  },
  {
    title: 'Jenkins and Nginx CI/CD Server',
    description: 'Jenkins on RHEL as a systemd service behind an Nginx reverse proxy with HTTPS, so it restarts on its own after a reboot.',
    highlights: [
      'Resolved 5 service incidents by reading systemd journals and Nginx access logs and fixing service and proxy configs.',
    ],
    tags: ['Jenkins', 'Nginx', 'RHEL', 'systemd', 'SSL/TLS'],
  },
  {
    title: 'Serverless Text-to-Speech API',
    description: 'A serverless text-to-speech API that responds in under 300 ms.',
    highlights: [
      'The Lambda role has only the Polly and logging permissions it needs.',
    ],
    tags: ['Lambda', 'API Gateway', 'Amazon Polly', 'IAM'],
  },
];

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) scrollToElement(el);
};
