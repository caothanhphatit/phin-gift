import ClassificationForm from '@/components/admin/ClassificationForm';
import dbConnect from '@/lib/mongodb';
import Classification from '@/models/Classification';
import { notFound } from 'next/navigation';

export default async function EditClassificationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await dbConnect();
    const doc = await Classification.findById(id).lean();

    if (!doc) {
        notFound();
    }

    // Convert ObjectId and Dates to string for Client Component serializability
    const classification = JSON.parse(JSON.stringify(doc));

    return <ClassificationForm initialData={classification} isEditing={true} />;
}
