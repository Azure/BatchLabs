import * as React from "react";
import { DataGrid } from "@batch/ui-react";

export const CertificateDisplay: React.FC = props => {
    // TODO: The certificate UI isn't ready, so have a list of dogs instead!
    const dogs: {name: string, breed: string, age: number, weight: number}[] = [
        {
            name: "Parker",
            breed: "Miniature schnauzer",
            age: 4,
            weight: 15
        },
        {
            name: "Savannah",
            breed: "Unknown mutt",
            age: 3,
            weight: 60
        },
    ];

    for (let i = 0; i < 100; i++) {
        dogs.push({
            name: `dog${i + 1}`,
            breed: `Breed ${i + 1}`,
            age: i,
            weight: i
        });
    }

    return (
        <DataGrid
            columns={["name", "breed", "age", "weight"]}
            items={dogs}
        />
    );
};
