import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { User } from "@/dto";
import AccessForm from "./AccessForm";

const  DATAPOINTS = [
    'Vehicle',
    'Trip',
    'Driver',
]

export const UserAccessModal = ({
    isModalOpen,
    setIsModalOpen,
    user,
}: {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | undefined
}) => {

    if (!user) {
        return <Dialog>
            <DialogContent>
                Cannot find selected user!
            </DialogContent>
        </Dialog>
    }
    return <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{`Give ${user.name} permissions`}</DialogTitle>
                <DialogDescription>
                    Be careful, they can see, edit and add new data to you database.
                </DialogDescription>
            </DialogHeader>
                <AccessForm user={user} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
    </Dialog>

}