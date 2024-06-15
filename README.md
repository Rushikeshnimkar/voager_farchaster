# Voyager_Chainlink
Voyager is an innovative social-fi app designed specifically for travelers, blending social networking with financial technology to create a unique experience.

## Overview

Voyager is an innovative social-fi app designed for modern travelers, blending social networking with financial technology to create a unique experience. This platform is divided into four core components: Random Chat App, Decentralized Onchain Identity, Cults, and Raids. The Voyager project leverages the Polygon Amoy network and uses Chainlink for various functionalities.

# User Story

**Suppose Shivani**  is a digital nomad embarking on a solo trip to Bali for a month. She is  new to solo travel and wants to experience the island while making friends. Voyager offers a unique platform to help her achieve both goals.

**Step 1: Making Connections:**

- Connect with People
- Shivani uses Voyager’s Random Chat App to meet other users. Here’s how it works:
- Filtered Connections: Shivani can filter connections based on shared interests, location (Bali), and interest (travelers, digital nomads).
- Three Levels of Interaction:
- Level 1: Basic information (age, gender).
- Level 2: Mutual "likes" unlock On-chain Profiles showcasing past adventures and contributions.
- Level 3: Earn "hearts" to unlock video chat and photo sharing.

**Step 2: Exploring Communities:**

- A delves into **Cults** (communities) to find like-minded people in Bali. These can be travel-based (travelers in Bali) or broader interests (digital nomads).
- He can:
    - Participate in **Fundraising Raffles** within relevant Cults, like supporting local artists.
    - Access **NFT-gated communities** (exclusive Discord servers) for a more focused experience.
    - Seek or provide **Opinions** within Cults. A can ask questions in music communities, offer travel advice in a digital nomad Cult, and earn rewards through upvotes or endorsements from those he helps.
- Voyager caters to A's specific needs as a traveler by offering location-based or global Cults, perfect for finding others with similar interests in Bali.

**Step 3: Joining the Adventure:**

- A discovers exciting **Raids** happening in Bali. These can be anything from DJ parties to carpool adventures across the island.
- He has two options:
    - **Join a Raid:** A can browse ongoing Raids, view details like descriptions, costs, and goals, and choose to participate by minting a Raid ticket (NFT).
    - **Create a Raid:** If A has a specific adventure in mind, he can create a Raid. This requires staking tokens, setting details like title, description, price per NFT, and a crowdfunding goal. Others can then join by minting Raid tickets or offering support.
- A can choose how to support Raids he doesn't join:
    - **Simple Opinion:** He can offer advice or answer questions related to the Raid's theme, potentially earning rewards for upvoted contributions.
    - **Couchsurfing:** A can offer to host fellow travelers during the Raid (if subscribed).
    - **Local Guide:** He can offer his services as a local guide for the Raid (if subscribed).
    - **Pay in Crypto:** A can directly contribute to the Raid's funding using Crypto.
- Completing successful Raids earns A **POAPs** (Proofs of Attendance Protocols), a digital badge signifying his participation.

**Voyager's Advantage:**

Unlike traditional social media, Voyager prioritizes genuine connection. By focusing on conversation and shared experiences, A can find friends based on his personality and interests. The platform caters specifically to travelers and digital nomads, offering features like couchsurfing and local guide services.

Through Voyager, A can navigate Bali with confidence, make friends along the way, and create unforgettable memories through unique adventures (Raids).

## Voyager Overall Workflow

### Random Chat App

- **Level-Based Interaction:** Users connect based on predefined interests, location, or gender. The interaction progresses through three levels, gradually revealing more information and enabling features like online games and blockchain-stored hearts.
- **Future Addition** : Video Chat feature , Quiz or Games to gamify the user experience to know more about opposite person

### Decentralized Onchain Identity

- **Profile Creation:** Users create a pseudo-anonymous profile that includes hearts (friendship indicators), raid participation records, and opinion points.
- **Token Bound Accounts:**  VoyagerProfile is a token-bound contract that stores user identities, ensuring security and privacy.

### Cults (Communities)

- **Community Building:** Users join cults based on interests like music, sports, or coding. Each cult can organize fundraising raids, decentralized raffles, and opinion polls.
- **Event Integration:** Cults can create and manage events, with tickets minted as NFTs.

### Raids

- **Types of Raids:** Users can create or join solo raids, event raids, or use Welcome To The Den for couchsurfing services.
- **Future Addition**:  Raids can be of any types from climate actions to

# Random Chat App :

# Raids

Raids is a blockchain-based crowdfunding platform within Voyager, designed to facilitate the organization and funding of physical events such as football matches, DJ parties, music concerts, and more. It connects Event Organizers and Contributors, allowing ideas to turn into reality through community support and transparent funding processes.

### Key Features:

1. **Proposal Submission and Voting:**
    - **Proposal Creators:** Users can submit event proposals, which are broadcasted to the Voyager community.
    - **Voting System:** Other users can vote on these proposals to indicate their interest and assess feasibility.
2. **Crowdfunding Conversion:**
    - **From Idea to Event:** Proposals that gather sufficient votes can be converted into crowdfunding events where Event Organizers set goals and timelines.
3. **Event Organization:**
    - **Role of Event Organizer:** The proposal submitter becomes the Event Organizer, defining crowdfunding goals, start/end times, and accepted stablecoins for contributions.
    - **NFT Ticketing:** Organizers can mint event tickets as NFTs, available.
4. **Staking Mechanism:**
    - **Organizer Commitment:** Event Organizers must stake a percentage (15-25%) of the crowdfunding goal to demonstrate commitment and ensure accountability.
5. **Funding Goal Achievement:**
    - **Successful Crowdfunding:** If the funding goal is met, the Event Organizer can withdraw funds (initially up to their staked amount).
    - **Expense Reporting:** For subsequent withdrawals, organizers must submit expense reports subject to a two-week validation period.
6. **Dispute Resolution:**
    - **Community Involvement:** Discrepancies in expense reporting can be disputed and discussed within the community, ensuring transparency and fairness.
    - **Voting on Disputes:** Users can vote on the resolution of disputes, potentially reclaiming their contributions if the organizer fails to meet obligations.
7. **Clear Flag System:**
    - **Event Evaluation:** After successful events, a clear flag system evaluates the organizer's performance, allowing them to unstake their funds if there are no issues.

**Benefits:**

- **Empowerment:** Enables individuals and organizations to bring event ideas to life through community support.
- **Transparency:** Ensures accountability and trust through staking, voting, and transparent expense reporting.
- **Community Engagement:** Fosters active participation and benefits from successful events, promoting a collaborative ecosystem.

## Smart Contracts

### On-Chain Profile Contracts

- **VoyagerProfile:** A token-bound contract that securely stores user identities and interactions.
- **VoyagerRegistry:** A creator contract that launches new cloned contracts for managing user profiles.

### Raids(Integration Of Chailink)

- Chainlink Functions : To call external to validate if the proposal can go forward or get’s rejected by the community.

### USDC Swap using CCIP

Voyager incorporates a swap feature for USDC using Chainlink’s CCIP, ensuring smooth and efficient cross-chain transactions.

# Deployment Addresses :

- VoyagerRaid: https://amoy.polygonscan.com/address/0xaf5793324C9de8e164E822652278AB8FC174C78e#code
- Voyager Profile(Scroll Sepolia) :  [https://sepolia.scrollscan.com/address/0x30b3d7E2da2D1c0d933f0bFe0E27cbe5C5091a45#code](https://sepolia.scrollscan.com/address/0x30b3d7E2da2D1c0d933f0bFe0E27cbe5C5091a45#code(VoyagerProfile))
- Voyager Registry(Scroll Sepolia) [: https://sepolia.scrollscan.com/address/0x1db948eE3Cd599FBB48a07aA09Ce1dF2462ec215#code](https://sepolia.scrollscan.com/address/0x1db948eE3Cd599FBB48a07aA09Ce1dF2462ec215#code(VoyagerRegistry))
