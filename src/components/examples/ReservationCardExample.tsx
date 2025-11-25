import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import {
    Calendar,
    Invoice,
    Maps,
    Members,
    Phone,
} from "@openai/apps-sdk-ui/components/Icon";

/**
 * Example component demonstrating OpenAI Apps SDK UI usage
 * This is a sample reservation card showing various SDK components
 */
export function ReservationCardExample() {
    return (
        <div className="w-full max-w-sm rounded-2xl border border-default bg-surface shadow-lg p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-secondary text-sm">
                        Reservation
                    </p>
                    <h2 className="mt-1 heading-lg">La Luna Bistro</h2>
                </div>
                <Badge color="success">Confirmed</Badge>
            </div>
            <div>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                    <dt className="flex items-center gap-1.5 font-medium text-secondary">
                        <Calendar className="size-4" />
                        Date
                    </dt>
                    <dd className="text-right">Apr 12 · 7:30 PM</dd>
                    <dt className="flex items-center gap-1.5 font-medium text-secondary">
                        <Members className="size-4" />
                        Guests
                    </dt>
                    <dd className="text-right">Party of 2</dd>
                    <dt className="flex items-center gap-1.5 font-medium text-secondary">
                        <Invoice className="size-4" />
                        Reference
                    </dt>
                    <dd className="text-right uppercase">4F9Q2K</dd>
                </dl>
            </div>
            <div className="mt-4 grid gap-3 border-t border-subtle pt-4 sm:grid-cols-2">
                <Button variant="soft" color="secondary" block>
                    <Phone />
                    Call
                </Button>
                <Button color="primary" block>
                    <Maps />
                    Directions
                </Button>
            </div>
        </div>
    );
}
