## Getting Started

### Infrastructure Provisioning

To provision the infrastructure, follow these steps:

1. Initialize the Terraform workspace by running:

```bash
terraform init
```

2. Review the planned infrastructure changes by running:

```bash
terraform plan
```

3. Apply the infrastructure changes by running:

```bash
terraform apply
```

> **Note:** Ensure you have AWS credentials configured on your machine with the profile `e-commerce` to provision the infrastructure successfully.

### Continuous Integration (CI) Process

To execute the Continuous Integration (CI) process, use the following command:

```bash
bash ci.sh
```

### Continuous Deployment (CD) Process

To execute the Continuous Deployment (CD) process, use the following command:

```bash
bash cd.sh
```

By following these instructions, you can set up and manage the infrastructure, CI, and CD processes efficiently.
