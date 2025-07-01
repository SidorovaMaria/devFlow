import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

//GET User by ID
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	//If id doesnt exist, return 404
	if (!id) throw new NotFoundError("User");
	try {
		await dbConnect();
		const user = await User.findById(id);
		if (!user) throw new NotFoundError("User");
		return NextResponse.json(
			{
				success: true,
				data: user,
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		return handleError(error, "api") as APIErrorrResponse;
	}
}

// DELETE User by ID
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	//If id doesnt exist, return 404
	if (!id) throw new NotFoundError("User");
	try {
		await dbConnect();
		const user = await User.findByIdAndDelete(id);
		if (!user) throw new NotFoundError("User");

		return NextResponse.json(
			{ success: true, data: user, message: "User deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return handleError(error, "api") as APIErrorrResponse;
	}
}

// Put User by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!id) throw new NotFoundError("User");
	try {
		await dbConnect();
		const body = await request.json();
		const validatedData = UserSchema.partial().safeParse(body);
		const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
			new: true,
		});
		if (!updatedUser) throw new NotFoundError("User");
		return NextResponse.json(
			{ sucess: true, data: updatedUser, message: "User updated successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return handleError(error, "api") as APIErrorrResponse;
	}
}
