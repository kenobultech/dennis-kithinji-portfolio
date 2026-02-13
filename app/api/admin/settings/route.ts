import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { getServerSession } from "next-auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { newUsername, newPassword } = await req.json();
    
    // Validate: At least one field must be provided
    if (!newUsername && !newPassword) {
        return NextResponse.json({ error: "No changes detected" }, { status: 400 });
    }

    await dbConnect();

    // Build the update object dynamically
    const updateData: any = {};
    
    if (newUsername && newUsername.trim() !== '') {
        updateData.username = newUsername;
    }
    
    if (newPassword && newPassword.trim() !== '') {
        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    await Admin.findOneAndUpdate({}, updateData, { new: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}