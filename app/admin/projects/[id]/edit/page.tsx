type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  return <main data-project-id={id}>{/* Project editor will go here. */}</main>;
}
