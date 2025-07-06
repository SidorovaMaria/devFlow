import { auth } from "@/auth";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { getUser } from "@/lib/actions/user.action";
import React from "react";
import { toast } from "sonner";

const EditProfile = async () => {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("You must be logged in to edit your profile.");
	}
	console.log(session.user.id);
	const { success, data, error } = await getUser({
		userId: session?.user?.id,
	});
	const { user } = data || {};
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
			<EditProfileForm user={data?.user!} />
		</>
	);
};

export default EditProfile;
