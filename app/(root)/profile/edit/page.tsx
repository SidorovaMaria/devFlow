import { auth } from "@/auth";
import EditProfileForm from "@/components/forms/EditProfileForm";
import { getUser } from "@/lib/actions/user.action";
import React from "react";

const EditProfile = async () => {
	const session = await auth();
	if (!session?.user?.id) {
		throw new Error("You must be logged in to edit your profile.");
	}

	const { success, data, error } = await getUser({
		userId: session?.user?.id,
	});
	return (
		<>
			<h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
			<EditProfileForm user={data?.user!} />
		</>
	);
};

export default EditProfile;
