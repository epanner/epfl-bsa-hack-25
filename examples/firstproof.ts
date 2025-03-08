import {
  Claim,
  Credential,
  Operation,
  PresentationSpec,
  PresentationRequest,
  Presentation,
} from 'mina-attestations';
import { Field } from 'o1js';

// Define a credential containing linear regression data points and model parameters
let credential = Credential.Native({
  x0: Field,
  x1: Field,
  x2: Field,
  x3: Field,
  y0: Field,
  y1: Field,
  y2: Field,
  y3: Field,
  weight: Field,  // Current weight (parameter) of the linear model
});

// Presentation specification to prove correctness of one gradient descent step
let spec = PresentationSpec(
  { credential, claimedGradient: Claim(Field) },
  ({ credential, claimedGradient }) => ({
    assert: [
      // Compute predicted values
      Operation.equals(
        claimedGradient,
        Operation.div(
          Operation.add(
            Operation.mul(
              Operation.sub(Operation.mul(Operation.property(credential,'x0'), Operation.property(credential,'weight')), Operation.property(credential,'y0')),
              Operation.property(credential,'x0')
            ),
            Operation.add(
              Operation.mul(
                Operation.sub(Operation.mul(Operation.property(credential,'x1'), Operation.property(credential,'weight')), Operation.property(credential,'y1')),
                Operation.property(credential,'x1')
              ),
              Operation.add(
              Operation.mul(
                Operation.sub(Operation.mul(Operation.property(credential,'x2'), Operation.property(credential,'weight')), Operation.property(credential,'y2')),
                Operation.property(credential,'x2')
              ),
              Operation.mul(
                Operation.sub(Operation.mul(Operation.property(credential,'x3'), Operation.property(credential,'weight')), Operation.property(credential,'y3')),
                Operation.property(credential,'x3')
              )
              )
            )
          ),
          Operation.constant(Field(4))
        )
      ),
    ],
    outputClaim: Operation.issuer(credential),
  })
);
let compiledSpec = await Presentation.precompile(spec);

let request = PresentationRequest.httpsFromCompiled(
  compiledSpec,
  { claimedGradient: Field(3) },
  { action: 'verify-citizenship' }
);
let requestJson = PresentationRequest.toJSON(request);
//await Credential.validate()