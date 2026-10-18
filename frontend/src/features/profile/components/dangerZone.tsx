import { useAuth } from "@/shared/auth/authContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSave } from "../hooks/useSave";
import { deleteMyAccount } from "../lib/api";
import Button from "@/shared/components/button";
import { FaTrash } from "react-icons/fa6";
import { SaveResult } from "./profileSettings";

export default function DangerZone() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { save, isSaving, result } = useSave();

  function handleDeleteAccount() {
    save(async () => {
      await deleteMyAccount();
      await logout();
      router.push("/");
      router.refresh();
    }, "Account deleted");
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border-2 border-error/60 p-4">
      <h3 className="flock-h5 text-error">Danger zone</h3>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <p className="flock-ui-label">Delete account</p>
          <p className="flock-caption">
            {"Deletes your account and everything you've created."}
            <br />
            {"This action cannot be undone."}
          </p>
        </div>
        {isConfirmingDelete ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="tertiary"
              size="sm"
              disabled={isSaving}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              icon={<FaTrash />}
              iconPlacement="left"
              className="bg-error text-white hover:bg-error-dark"
              disabled={isSaving}
              onClick={handleDeleteAccount}
            >
              {isSaving ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            icon={<FaTrash />}
            iconPlacement="left"
            className="shrink-0 border-error text-error hover:border-error-dark hover:bg-error/10 hover:text-error-dark"
            onClick={() => setIsConfirmingDelete(true)}
          >
            Delete account
          </Button>
        )}
      </div>
      <SaveResult result={result} />
    </section>
  );
}
