import { EcdsaEthereum } from 'mina-attestations/imported';
let spec = PresentationSpec(
  { passport: PassportCredential.spec, createdAt: Claim(UInt64) },
  ({ passport, createdAt }) => ({
    assert: [
      // not from the United States
      Operation.not(
        Operation.equals(
          Operation.property(passport, 'nationality'),
          Operation.constant(
            PassportCredential.Nationality.from('United States')
          )
        )
      ),

      // passport is not expired
      Operation.lessThanEq(
        createdAt,
        Operation.property(passport, 'expiresAt')
      ),

      // hard-code passport verification key
      Operation.equals(
        Operation.verificationKeyHash(passport),
        Operation.constant(vk.hash)
      ),
    ],
    // return public input (passport issuer hash) for verification
    outputClaim: Operation.publicInput(passport),
  })
);