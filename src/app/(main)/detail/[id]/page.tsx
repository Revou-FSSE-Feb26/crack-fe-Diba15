export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const id: string = resolvedParams.id

    return (
        <div>{id}</div>
    )
}