const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient(); // Database client

app.get("/", async (req, res) => {
    res.send("Bitespeed Backend Task is running!");
});

// Test DB connection
app.get("/test-db", async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Identify API
app.post("/identify", async (req, res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: "At least one of email or phoneNumber is required" });
    }

    try {
        // Step 1: Find existing contacts that match either email or phoneNumber
        const existingContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { email: email || undefined },
                    { phoneNumber: phoneNumber || undefined }
                ]
            }
        });

        if (existingContacts.length === 0) {
            // Step 2: No existing contacts, create a new primary contact
            const newContact = await prisma.contact.create({
                data: {
                    email: email || null,
                    phoneNumber: phoneNumber || null,
                    linkPrecedence: "primary"
                }
            });

            return res.json({
                contact: {
                    primaryContactId: newContact.id,
                    emails: [newContact.email].filter(Boolean),
                    phoneNumbers: [newContact.phoneNumber].filter(Boolean),
                    secondaryContactIds: []
                }
            });
        }

        // Step 3: Identify the primary contact
        let primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];

        // Step 4: Ensure all contacts are linked to the primary contact
        for (let contact of existingContacts) {
            if (contact.linkPrecedence === "primary" && contact.id !== primaryContact.id) {
                // Convert this primary to a secondary and link it to the true primary
                await prisma.contact.update({
                    where: { id: contact.id },
                    data: { linkedId: primaryContact.id, linkPrecedence: "secondary" }
                });
            }
        }

        // Step 5: Check if new email or phoneNumber needs to be added
        const isNewEmail = email && !existingContacts.some(c => c.email === email);
        const isNewPhone = phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber);

        let newContact = null;
        if (isNewEmail || isNewPhone) {
            // Only create a new secondary contact if it's truly new
            newContact = await prisma.contact.create({
                data: {
                    email: isNewEmail ? email : null,
                    phoneNumber: isNewPhone ? phoneNumber : null,
                    linkedId: primaryContact.id,
                    linkPrecedence: "secondary"
                }
            });
        }

        // Step 6: Gather all secondary contacts
        const secondaryContacts = await prisma.contact.findMany({
            where: { linkedId: primaryContact.id }
        });

        // Step 7: Prepare response
        const response = {
            contact: {
                primaryContactId: primaryContact.id,
                emails: [
                    primaryContact.email,
                    ...secondaryContacts.map(c => c.email)
                ].filter(Boolean),
                phoneNumbers: [
                    primaryContact.phoneNumber,
                    ...secondaryContacts.map(c => c.phoneNumber)
                ].filter(Boolean),
                secondaryContactIds: secondaryContacts.map(c => c.id)
            }
        };

        res.json(response);
    } catch (error) {
        console.error("Error in /identify:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
